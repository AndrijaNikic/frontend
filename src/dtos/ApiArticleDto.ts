export default interface ApiArticleDto {
        articleId?: number;
        name?: string;
        categoryId?: number;
        description?: string;
        imagePath?: string;
        ingredients?: string;
        price?: number;
        category?: {
            name: string;
        };
        photos?: {
            photoId: number,
            imagePath: string
        };
}