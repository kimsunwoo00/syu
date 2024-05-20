// utils.js

export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error:', error);
        return '파일 업로드 중 오류가 발생했습니다.';
    }
};
