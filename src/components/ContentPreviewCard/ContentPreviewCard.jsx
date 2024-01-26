import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { getSignedURLForImage } from '../../utilities/images-service';
import './ContentPreviewCard.css'

export default function ContentPreviewCard({ content , type}) { 
    let essayPath;
    if (content.isMain) {
        essayPath = `/read`;
    } else if (type === 'essay') {
        essayPath = `/side-essays/${content._id}`;
    } else if (type === 'blog') {
        essayPath = `/blog/${content._id}`;
    }
    const [mainEssayCoverPhotoSignedUrl, setMainEssayCoverPhotoSignedUrl] = useState("");
    useEffect(()=>{
        async function getMainEssayCoverPhotoSignedUrl(coverPhotoS3Key){
            const response = await getSignedURLForImage(coverPhotoS3Key);
            if(response && !response.error){
                setMainEssayCoverPhotoSignedUrl(response.data.url);
            }
        }
        getMainEssayCoverPhotoSignedUrl(content.coverPhotoS3Key);
    }, []);

    const [dateUpdated, ...timeUpdated] = moment(content.updatedAt).format('MM/DD/YYYY hh:mm a').split(' ');

    return (
        <Card sx={{ backgroundColor: '#A3B18A', marginTop: '1rem', marginBottom: '1rem' }}>
            <CardActionArea href={essayPath}
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                }}>
                {mainEssayCoverPhotoSignedUrl && <CardMedia
                    component="img"
                    height="100%"
                    image={mainEssayCoverPhotoSignedUrl}
                    alt="Cover Image"
                    className='essay-cover-image'
                    sx={{
                        width: '16rem',
                        height: '16rem',
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }}
                />}
                <CardContent sx={{}} className='essay-card-body'>

                    <Typography variant="h4" color="text.primary">
                        {content.title}
                    </Typography>
                    <Typography variant="h5" color="text.primary">
                        By: {content.author.name}
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                        Last Updated on {dateUpdated} at {timeUpdated}.
                    </Typography>
                    
                </CardContent>
            </CardActionArea>
        </Card>
    );
}