import os
from typing import TypedDict, List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, START, END

# Define state structure
class AgentState(TypedDict):
    prompt: str
    draft: str
    instagram_version: str
    linkedin_version: str
    tags: List[str]

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Define LLM setup
API_KEY = os.environ.get("GOOGLE_API_KEY", os.environ.get("GEMINI_API_KEY", ""))
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=API_KEY,
    temperature=0.7
)

# 1. Draft post Node
def draft_post(state: AgentState) -> dict:
    prompt = ChatPromptTemplate.from_template(
        "You are a professional social media content creator. Write a compelling social media post draft based on this prompt: '{prompt}'."
    )
    chain = prompt | llm
    response = chain.invoke({"prompt": state["prompt"]})
    return {"draft": response.content}

# 2. Optimize for Instagram Node
def optimize_instagram(state: AgentState) -> dict:
    prompt = ChatPromptTemplate.from_template(
        "Take this base social media post draft:\n\n{draft}\n\nOptimize it for Instagram. It should be visually engaging, have clean paragraph spacing, a friendly tone, and a clear call-to-action. Do not include too many hashtags."
    )
    chain = prompt | llm
    response = chain.invoke({"draft": state["draft"]})
    return {"instagram_version": response.content}

# 3. Optimize for LinkedIn Node
def optimize_linkedin(state: AgentState) -> dict:
    prompt = ChatPromptTemplate.from_template(
        "Take this base social media post draft:\n\n{draft}\n\nOptimize it for LinkedIn. It should have a professional yet approachable tone, a strong hook in the first two lines, bullet points for readability, and a clear call-to-action for engagement. Do not include too many hashtags."
    )
    chain = prompt | llm
    response = chain.invoke({"draft": state["draft"]})
    return {"linkedin_version": response.content}

# 4. Extract Tags Node
def extract_tags(state: AgentState) -> dict:
    prompt = ChatPromptTemplate.from_template(
        "Based on this social media draft:\n\n{draft}\n\nExtract 5-6 relevant hashtags. Return ONLY the hashtags as a comma-separated list, e.g. '#Creator, #Setup, #Design'. Make sure each tag starts with a '#'."
    )
    chain = prompt | llm
    response = chain.invoke({"draft": state["draft"]})
    tags_list = [tag.strip() for tag in response.content.split(",") if tag.strip()]
    return {"tags": tags_list}

# Compile Graph
workflow = StateGraph(AgentState)
workflow.add_node("draft_post", draft_post)
workflow.add_node("optimize_instagram", optimize_instagram)
workflow.add_node("optimize_linkedin", optimize_linkedin)
workflow.add_node("extract_tags", extract_tags)

workflow.add_edge(START, "draft_post")
workflow.add_edge("draft_post", "optimize_instagram")
workflow.add_edge("draft_post", "optimize_linkedin")
workflow.add_edge("draft_post", "extract_tags")
workflow.add_edge("optimize_instagram", END)
workflow.add_edge("optimize_linkedin", END)
workflow.add_edge("extract_tags", END)

app = workflow.compile()

def generate_social_content(user_prompt: str) -> dict:
    initial_state = {
        "prompt": user_prompt,
        "draft": "",
        "instagram_version": "",
        "linkedin_version": "",
        "tags": []
    }
    result = app.invoke(initial_state)
    return {
        "draft": result.get("draft", ""),
        "instagram": result.get("instagram_version", ""),
        "linkedin": result.get("linkedin_version", ""),
        "tags": result.get("tags", [])
    }
