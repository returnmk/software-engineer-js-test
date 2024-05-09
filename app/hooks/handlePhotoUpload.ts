import React, { Dispatch, SetStateAction, RefObject } from 'react';

export const usePhotoUpload = (
    setImage: Dispatch<SetStateAction<HTMLImageElement | undefined>>,
    setImageX: Dispatch<SetStateAction<number>>,
    setImageY: Dispatch<SetStateAction<number>>
) => {
    return async (e: React.ChangeEvent<HTMLInputElement>) => {
        // get all selected Files
        const files = e.target.files as FileList;
        let file;
        for ( let i = 0; i < files.length; ++i ) {
            file = files[ i ];
            // check if file is valid Image (just a MIME check)
            switch ( file.type ) {
                case "image/jpeg":
                case "image/png":
                case "image/gif":
                    // read Image contents from file
                    const reader = new FileReader();
                    reader.onload = (e: ProgressEvent<FileReader>) => {
                        // create HTMLImageElement holding image data
                        const img = new Image();
                        img.src = reader.result as string;
                        img.onload = () => setImage(img);
                        setImageX(0);
                        setImageY(0);
                    };
                    reader.readAsDataURL( file );
                    // Reset the file input after reading the file
                    e.target.value = '';
                    // process just one file
                    return;
            }
        }

    };
};
