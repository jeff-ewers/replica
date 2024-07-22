from rest_framework import viewsets, status, serializers
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from api.models import Project  

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'project_type', 'created_at', 'updated_at']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    """JSON serializer for Users
    Arguments:
    serializers
    """
    projects = ProjectSerializer(many=True, read_only=True)

    class Meta:
        model = User
        url = serializers.HyperlinkedIdentityField(
            view_name='user',
            lookup_field='id'
        )
        fields = ('id', 'url', 'username', 'first_name', 'last_name', 'email', 'is_active', 'date_joined', 'projects')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        email = request.query_params.get('email', None)
        if email is not None:
            user = get_object_or_404(User, email=email)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        return super().list(request)