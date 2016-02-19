from django.contrib.auth.models import User
from kordecms.models import Article, ArticleComment
from kordecms.permissions import ArticleAuthorCanEditPermission, SafeMethodsOnlyPermission
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


class ArticleMixin(object):
    model = Article
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    permission_classes = [
        ArticleAuthorCanEditPermission
    ]

    def pre_save(self, obj):
        """Force author to the current user on save"""
        obj.author = self.request.user
        return super(ArticleMixin, self).pre_save(obj)


class ArticleList(ArticleMixin, generics.ListCreateAPIView):
    pass


class ArticleDetail(ArticleMixin, generics.RetrieveUpdateDestroyAPIView):
    pass


class UserArticleList(generics.ListAPIView):
    model = Article
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_queryset(self):
        queryset = super(UserArticleList, self).get_queryset()
        return queryset.filter(author__id=self.kwargs.get('author_id'))


class ArticleCommentMixin(object):
    model = ArticleComment
    serializer_class = ArticleCommentSerializer
    queryset = ArticleComment.objects.all()

    def pre_save(self, obj):
        """Force author to the current user on save"""
        obj.author = self.request.user
        return super(ArticleCommentMixin, self).pre_save(obj)


class ArticleCommentList(ArticleCommentMixin, generics.ListAPIView):
    def get_queryset(self):
        queryset = super(ArticleCommentList, self).get_queryset()
        return queryset.filter(article__id=self.kwargs.get('id'))


class ArticleCommentDetail(ArticleCommentMixin, generics.RetrieveUpdateDestroyAPIView):
    pass
