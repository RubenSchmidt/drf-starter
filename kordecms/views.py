from django.contrib.auth.models import User
from kordecms.models import Article, ArticleComment
from kordecms.serializers import ArticleSerializer, ArticleCommentSerializer, UserSerializer
from rest_framework import permissions, generics


class UserList(generics.ListCreateAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]


class UserDetail(generics.RetrieveAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class ArticleList(generics.ListCreateAPIView):
    model = Article
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Article
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class UserArticleList(generics.ListAPIView):
    model = Article
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_queryset(self):
        queryset = super(UserArticleList, self).get_queryset()
        return queryset.filter(author__id=self.kwargs.get('author_id'))


class ArticleCommentList(generics.ListAPIView):
    model = ArticleComment
    serializer_class = ArticleCommentSerializer
    queryset = ArticleComment.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        queryset = super(ArticleCommentList, self).get_queryset()
        return queryset.filter(article__id=self.kwargs.get('id'))


class ArticleCommentDetail(generics.RetrieveUpdateDestroyAPIView):
    model = ArticleComment
    serializer_class = ArticleCommentSerializer
    queryset = ArticleComment.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
