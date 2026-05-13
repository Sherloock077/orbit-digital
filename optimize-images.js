// Скрипт для оптимизации изображений
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async () => {
    try {
        // Оптимизация всех изображений в папке assets
        const files = await imagemin(['src/assets/*.{jpg,png}'], {
            destination: 'src/assets/optimized',
            plugins: [
                imageminMozjpeg({ quality: 75 }), // Сжатие JPEG
                imageminPngquant({ quality: [0.6, 0.8] }) // Сжатие PNG
            ]
        });

        console.log('Оптимизация завершена. Файлы:', files.map(file => file.sourcePath));
    } catch (error) {
        console.error('Ошибка при оптимизации изображений:', error);
    }
})();