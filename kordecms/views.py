from django.contrib.auth.models import User
from kordecms.models import Page, Article, ArticleComment, PageElement
from kordecms.permissions import ArticleAuthorCanEditPermission, SafeMethodsOnlyPermission
from kordecms.serializers import ArticleSerializer, ArticleCommentSerializer, UserSerializer, PageSerializer, \
    PageElementSerializer
from django.utils.translation import ugettext_lazy as _
from rest_framework import permissions, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render


def index_view(request):
    return render(request, 'index.html', {})


class PageList(generics.ListCreateAPIView):
    model = Page
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]


class PageDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Page
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    lookup_field = 'slug'
    permission_classes = [
        permissions.IsAdminUser
    ]


class PageElementDetail(generics.RetrieveUpdateDestroyAPIView):
    model = PageElement
    queryset = PageElement.objects.all()
    serializer_class = PageElementSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]

    def perform_update(self, serializer):
        obj = serializer.validated_data
        # Type is image
        if obj['type'] == 0:
            # New image file is uploaded
            if self.request.FILES.get('file'):
                serializer.save(image_src=self.request.FILES.get('file'))
                return
        # save the normal way
        serializer.save()


class PageElementList(generics.ListAPIView):
    model = PageElement
    queryset = PageElement.objects.all()
    serializer_class = PageElementSerializer
    lookup_field = 'slug'
    permission_classes = [
        permissions.IsAdminUser
    ]

    def get_queryset(self):
        queryset = super(PageElementList, self).get_queryset()
        return queryset.filter(page__slug=self.kwargs.get('slug'))


@api_view(['GET'])
def get_page_elements_sorted(request, slug):
    queryset = PageElement.objects.filter(page__slug=slug).order_by('row', 'col')
    if not queryset:
        return Response(_('Could not find the page elements'), status=status.HTTP_404_NOT_FOUND)

    rows = []
    temp = []
    check = 0
    index = 0
    for r in queryset:
        serialized = PageElementSerializer(r).data
        index = r.row - 1
        if index == check:
            temp.append(serialized)

        else:
            rows.append(temp)
            temp = [serialized]
            check = index

    # Only one row, therefore temp is not added in the for loop
    if check == index:
        rows.append(temp)

    return Response(data=rows, status=status.HTTP_200_OK)


class UserList(generics.ListCreateAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class ArticleMixin(object):
    model = Article
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticleSerializer

    permission_classes = [
        ArticleAuthorCanEditPermission
    ]

    def perform_create(self, serializer ):
        """Force author to the current user on save"""
        serializer.save(author=self.request.user)


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
