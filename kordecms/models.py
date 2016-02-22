from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _
from taggit.managers import TaggableManager

# Enum used for page and article elements
TYPE_IMAGE = 0
TYPE_TEXT = 1
ELEMENT_TYPE_CHOICES = (
    (TYPE_IMAGE, _('Image element')),
    (TYPE_TEXT, _('Text element'))
)

# Enum used with article elements.
ELEMENT_HALF = 0
ELEMENT_FULL = 1
ELEMENT_WIDTH_CHOICES = (
    (ELEMENT_FULL, _('Full element')),
    (ELEMENT_HALF, _('Half element'))
)


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
        verbose_name=_('Parent page'),
        related_name='elements')

    type = models.IntegerField(
        verbose_name=_('Element type'),
        choices=ELEMENT_TYPE_CHOICES)

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
    Article model. Contains no paragraphs or images. Only Meta info about article
    """
    # TODO use signals to notify the article model of the child elements on post_save to update last_updated
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


class ArticleElement(models.Model):
    """
    Article element.
    Can either be image or text.
    Can either be half or full.
    Both text and image can be null, but one of them should be set accordingly.
    """
    # TODO implement check on save for existance of text or image if text or image element is chosen
    article = models.ForeignKey(
        Article,
        verbose_name=_('Parent article'),
        on_delete=models.CASCADE,
        related_name='elements'
    )

    # Either image or text
    type = models.IntegerField(
        verbose_name=_('Element type'),
        choices=ELEMENT_TYPE_CHOICES)

    # Either half or full
    width_type = models.IntegerField(
        verbose_name=_('Element width type'),
        choices=ELEMENT_WIDTH_CHOICES
    )

    text = models.TextField(
        verbose_name=_('article paragraph'),
        blank=True
    )

    image_src = models.ImageField(
        verbose_name=_('article image'),
        upload_to='articleimages/%Y/%m/%d/',
        null=True,
        blank=True)


class ArticleComment(models.Model):
    """
    Article comments, made by other users
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
