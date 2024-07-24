from rest_framework import viewsets, serializers, status
from rest_framework.response import Response
from api.models import Condition

class ConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condition
        fields = ['id', 'project', 'name', 'description']

class ConditionViewSet(viewsets.ModelViewSet):
    serializer_class = ConditionSerializer
    queryset = Condition.objects.all()

    def get_queryset(self):
        queryset = Condition.objects.all()
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(name__iexact=name)
        return queryset


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)