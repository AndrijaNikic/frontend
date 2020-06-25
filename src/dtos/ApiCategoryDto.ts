export default interface ApiCategoryDto {
        categoryId: number;
        name: string;
        description: string;
        imagePath: string;
        measurement: string;
        categoryPhotos: {
                imagePath: string
        };
      
}