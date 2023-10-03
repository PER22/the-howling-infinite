import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import sendRequest from '../../utilities/send-request';
import { useEffect, useState } from 'react';


export default function ContentPreviewCard({ content }) {
    const [signedURL, setSignedURL] = useState(null);
    useEffect(() => {
        async function fetchSignedURL() {
            if (content.coverPhotoS3Key && content.coverPhotoS3Key !== 'undefined') {
                try {
                    const response = await sendRequest(`/api/content/image-url/${content._id}`);
                    if (response) {
                        setSignedURL(response.signedURL);
                    }
                } catch (error) {
                    console.error("Error fetching signed URL:", error);
                }
            }
        }
        fetchSignedURL();
    }, [content._id, content.coverPhotoS3Key]);

    let essayPath;
    if (content.isMain) {
        essayPath = "/read";
    } else if (content.type === 'essay') {
        essayPath = `/side-essays/${content._id}`;
    } else if (content.type === 'blog') {
        essayPath = `/blog/${content._id}`;
    }

    return (
        <Card sx={{ backgroundColor: '#A3B18A', marginTop: '1rem', marginBottom: '1rem' }}>
            <CardActionArea href={essayPath}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'flex-start'
                }}>
                {signedURL && <CardMedia
                    component="img"
                    height="140"
                    image={signedURL}
                    alt="Cover Image"
                    className='essay-cover-image'
                    sx={{
                        width: '10rem',
                        height: '10rem',
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }}
                />}
                <CardContent className='essay-card-body'>
                    <Typography variant="h5" component="div">
                        {content.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <span dangerouslySetInnerHTML={{ __html: content.preview }} />
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}