from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ProjectViewSet, ProjectTypeViewSet, ConditionViewSet,
    DataFileViewSet, MetadataViewSet, AnalysisViewSet, AnalysisTypeViewSet,
    ProjectAnalysisTypeViewSet, ProjectTypeAnalysisTypeViewSet,
    GSEALibraryViewSet, AnalysisParameterViewSet, AnalysisParameterValueViewSet,
    ResultViewSet, MLModelViewSet, VisualizationViewSet, ProteinViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'project-types', ProjectTypeViewSet)
router.register(r'conditions', ConditionViewSet)
router.register(r'datafiles', DataFileViewSet)
router.register(r'metadata', MetadataViewSet)
router.register(r'analyses', AnalysisViewSet)
router.register(r'analysis-types', AnalysisTypeViewSet)
router.register(r'project-analysis-types', ProjectAnalysisTypeViewSet)
router.register(r'project-type-analysis-types', ProjectTypeAnalysisTypeViewSet)
router.register(r'gsea-libraries', GSEALibraryViewSet)
router.register(r'analysis-parameters', AnalysisParameterViewSet)
router.register(r'analysis-parameter-values', AnalysisParameterValueViewSet)
router.register(r'results', ResultViewSet)
router.register(r'ml-models', MLModelViewSet)
router.register(r'visualizations', VisualizationViewSet)
router.register(r'proteins', ProteinViewSet)

urlpatterns = [
    path('', include(router.urls)),
]