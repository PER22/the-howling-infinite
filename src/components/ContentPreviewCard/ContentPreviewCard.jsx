import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


export default function ContentPreviewCard({ content , type}) {
    //console.log(content);
    let essayPath;
    if (content.isMain) {
        essayPath = `/read`;
    } else if (type === 'essay') {
        essayPath = `/side-essays/${content._id}`;
    } else if (type === 'blog') {
        essayPath = `/blog/${content._id}`;
    }

    return (
        <Card sx={{ backgroundColor: '#A3B18A', marginTop: '1rem', marginBottom: '1rem', width: '80%' }}>
            <CardActionArea href={essayPath}
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                }}>
                {content.coverPhotoS3Key && <CardMedia
                    component="img"
                    height="140"
                    image={`/api/images/${content.coverPhotoS3Key}`}
                    alt="Cover Image"
                    className='essay-cover-image'
                    sx={{
                        width: '10rem',
                        height: '10rem',
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }}
                />}
                <CardContent sx={{}} className='essay-card-body'>
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