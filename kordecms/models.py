from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _
from taggit.managers import TaggableManager


class KordeEditableModel(models.Model):
    class_type = models.CharField(
        verbose_name=_('classtype'),
        max_length=50,
        blank=True
    )

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.class_type = self.__class__.__name__
        super(KordeEditableModel, self).save(*args, **kwargs)


class Page(models.Model):
    name = models.CharField(
        max_length=200,
        unique=True,
        db_index=True,
        verbose_name=_('Pagename')
    )

    slug = models.SlugField(
        verbose_name=_('Page slug'),
        unique=True,
        blank=True
    )

    thumbnail = models.ImageField(
        verbose_name=_('Page thumbnail'),
        null=True,
        blank=True,
        upload_to='pagethumbnails/%Y/%m/%d/'
    )

    thumbnail_url = models.CharField(
        verbose_name=_('image url'),
        max_length=200,
        blank=True
    )

    class Meta:
        verbose_name = _('Page')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.id:
            # Newly created object, so set slug
            self.slug = slugify(self.name)
        super(Page, self).save(*args, **kwargs)

    @property
    def thumbnail_url(self):
        if self.thumbnail:
            return self.thumbnail.url
        return None

    def get_page_elements(self):
        return Page.objects.filter(page=self)


class PageElement(KordeEditableModel):
    TYPE_IMAGE = 0
    TYPE_TEXT = 1
    TYPE_CHOICES = (
        (TYPE_IMAGE, _('Image element')),
        (TYPE_TEXT, _('Text element'))
    )

    row = models.IntegerField(
        verbose_name=_('row')
    )

    col = models.IntegerField(
        verbose_name=_('column'),
        null=True,
        blank=True
    )

    page = models.ForeignKey(
        Page,
        on_delete=models.CASCADE,
        verbose_name=_('Parent page'))

    type = models.IntegerField(
        verbose_name=_('Element type'),
        choices=TYPE_CHOICES)

    body = models.TextField(
        verbose_name=_('Element text'),
        blank=True)

    image_src = models.ImageField(
        verbose_name=_('Element image source'),
        blank=True, null=True,
        upload_to='pageelements/%Y/%m/%d/')

    description = models.TextField(
        blank=True,
        verbose_name=_('Element description')
    )

    class Meta:
        verbose_name = _('Page element')

    def __str__(self):
        return '{},{}'.format(self.description, self.page)

    @property
    def image_url(self):
        if self.image_src:
            return self.image_src.url
        return None


class Article(KordeEditableModel):
    """
    Article model for korde CMS.
    """
    body = models.TextField(
        blank=True,
        verbose_name=_('text'))

    title = models.TextField(
        blank=True,
        verbose_name=_('title'))

    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name=_('author'))

    author_name = models.TextField(
        blank=True,
        verbose_name=_('author name'))

    last_updated = models.DateTimeField(
        auto_now=True,
        verbose_name=_('last updated'))
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('created at'))

    tags = TaggableManager(
        blank=True
    )

    tag_string = models.CharField(
        verbose_name=_('Tag string'),
        blank=True,
        max_length=300
    )

    is_published = models.BooleanField(
        default=False
    )

    class Meta:
        verbose_name = _('article')

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.author_name = '{} {}'.format(self.author.first_name, self.author.last_name)
        if len(self.tag_string) > 0:
            tag_list = self.tag_string.split(',')
            for tag_name in tag_list:
                self.tags.add(tag_name.strip())

        super(Article, self).save(*args, **kwargs)  # Call the "real" save() method.

    @property
    def tags_list(self):
        return [tag.name for tag in self.tags.all()]

    def get_number_of_comments(self):
        return ArticleComment.objects.filter(article=self).count()


class ArticleComment(models.Model):
    """
    Article comments for korde CMS
    """
    text = models.TextField(
        blank=True,
        verbose_name=_('comment text'))

    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        verbose_name=_('article'))

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name=_('article author'))

    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('article comment')

    def __str__(self):
        return '{}, {}'.format(self.id, self.article)


class ArticleImage(models.Model):
    """
    Article image, related with an article.
    """

    article = models.ForeignKey(
        Article,
        on_delete=models.SET_NULL,
        verbose_name=_('article'),
        null=True)

    src = models.ImageField(
        verbose_name=_('article image'),
        upload_to='articleimages/%Y/%m/%d/')
    # Tags, example image.tags.add("red", "green", "delicious")
    tags = TaggableManager()
