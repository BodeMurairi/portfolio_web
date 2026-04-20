#!/usr/bin/env python3

from utils.http_status_code import NotFound, BadRequest, Unauthorized
from utils.helpers import orm_to_dict_articles
from services.articles.view_articles import ViewArticles
from services.admin.blog.article_management import ArticleManagement
from schemas.blog import Articles as article_schema
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.database_model import Article, ArticleStat

def read_articles(db:Session):
    """read all articles"""
    articles = ViewArticles(db=db)
    get_articles = articles.view_articles()
    if not get_articles:
        return []
    return [article_schema.model_validate(orm_to_dict_articles(article)) for article in get_articles]

def read_article_type(db:Session, article_type:str):
    """get article per type"""
    articles = ViewArticles(db=db)
    get_article_type = articles.get_article_perType(article_type=article_type)
    if not get_article_type:
        return []
    return [article_schema.model_validate(orm_to_dict_articles(article)) for article in get_article_type]

def get_article_id(db: Session, article_id: str):
    """get an article"""
    get_article = ViewArticles(db=db)
    article = get_article.get_article(article_id=article_id)
    if not article:
        raise NotFound("No article with that id found")

    article_obj = article_schema.model_validate(orm_to_dict_articles(article))
    return article_obj.model_dump()

def update_count_view(db:Session, article_id:str):
    """update article view count"""
    article_management = ArticleManagement(db=db)
    return article_management.count_view(article_id=article_id)

def update_likes(db:Session, article_id:str):
    """update article likes"""
    article_management = ArticleManagement(db=db)
    return article_management.likes_count(article_id=article_id)

def read_count(db:Session, article_id:str):
    """update article read count"""
    article_management = ArticleManagement(db=db)
    return article_management.read_count(article_id=article_id)

def get_article_stats(db: Session, article_id: str) -> dict:
    """Return likes and views count for an article"""
    article = db.query(Article).filter(Article.article_sys_id == article_id).first()
    if not article:
        raise NotFound("Article not found")
    stat = db.query(ArticleStat).filter(ArticleStat.article_id == article.id).first()
    return {
        "likes_count": stat.likes_count if stat else 0,
        "views_count": stat.views_count if stat else 0,
    }

def get_popular_topics(db: Session) -> list:
    """Return article types sorted by total likes descending"""
    results = (
        db.query(
            Article.type,
            func.coalesce(func.sum(ArticleStat.likes_count), 0).label("total_likes")
        )
        .outerjoin(ArticleStat, ArticleStat.article_id == Article.id)
        .filter(Article.type.isnot(None))
        .group_by(Article.type)
        .order_by(func.coalesce(func.sum(ArticleStat.likes_count), 0).desc())
        .all()
    )
    return [{"type": r.type, "likes": int(r.total_likes)} for r in results]

def generate_article_pdf(db: Session, article_id: str):
    """Generate a PDF of the article and return (bytes, title)"""
    from fpdf import FPDF

    # Helvetica only supports Latin-1; replace common Unicode characters
    _UNICODE_MAP = str.maketrans({
        "\u2026": "...",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2013": "-",
        "\u2014": "--",
        "\u2022": "-",
        "\u00b7": "-",
        "\u00a0": " ",
        "\u2032": "'",
        "\u2033": '"',
        "\u00ae": "(R)",
        "\u00a9": "(c)",
        "\u2122": "(TM)",
    })

    def clean(text: str) -> str:
        if not text:
            return ""
        return text.translate(_UNICODE_MAP).encode("latin-1", errors="replace").decode("latin-1")

    article = db.query(Article).filter(Article.article_sys_id == article_id).first()
    if not article:
        raise NotFound("Article not found")

    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Title
    pdf.set_font("Helvetica", "B", 18)
    pdf.multi_cell(0, 10, clean(article.title))
    pdf.ln(3)

    # Subtitle
    if article.subtitle:
        pdf.set_font("Helvetica", "I", 12)
        pdf.multi_cell(0, 8, clean(article.subtitle))
        pdf.ln(2)

    # Author + date
    pdf.set_font("Helvetica", "", 10)
    date_str = article.updated_at.strftime("%b %d, %Y") if article.updated_at else ""
    pdf.cell(0, 8, clean(f"By {article.author_name}   {date_str}"), ln=True)
    pdf.ln(5)

    # Headline
    if article.headline:
        pdf.set_font("Helvetica", "B", 11)
        pdf.multi_cell(0, 7, clean(article.headline))
        pdf.ln(4)

    # Body
    pdf.set_font("Helvetica", "", 11)
    for para in (article.content or "").split("\n"):
        if para.strip():
            pdf.multi_cell(0, 7, clean(para.strip()))
            pdf.ln(2)

    return bytes(pdf.output()), clean(article.title)
