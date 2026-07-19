from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .agent import generate_social_content

@api_view(['POST'])
def generate_post_view(request):
    prompt = request.data.get('prompt')
    if not prompt:
        return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        content = generate_social_content(prompt)
        return Response(content, status=status.HTTP_200_OK)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
