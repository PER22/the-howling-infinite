import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import sendRequest from '../../utilities/send-request';
import { useEffect, useState } from 'react';

export default function EssayPreviewCard({ essay }) {
  // const [signedURL, setSignedURL] = useState(null);
  // useEffect(() => {
  //     async function fetchSignedURL() {
  //       if(essay.coverPhotoS3Key && essay.coverPhotoS3Key !== 'undefined'){
  //         try {
  //             const response = await sendRequest(`/api/essays/image-url/${essay.coverPhotoS3Key}`);
  //             if (response.status === 200) {
  //                 const data = response;
  //                 setSignedURL(data.signedURL);
  //             }
  //         } catch (error) {
  //             console.error("Error fetching signed URL:", error);
  //         }
  //       }
  //     }
  //     fetchSignedURL();
  // }, []);

  const essayPath = essay.isMain ? "/read" : `/side-essays/${essay._id}`;

  return (
      <Card>
          <CardActionArea href={essayPath}>
              {/* {signedURL && <CardMedia
                  component="img"
                  height="140"
                  image={signedURL}
                  alt="Cover Image"
              />} */}
              <CardContent>
                  <Typography variant="h5" component="div">
                      {essay.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                      <span dangerouslySetInnerHTML={{ __html: essay.bodyText}} />
                  </Typography>
              </CardContent>
          </CardActionArea>
      </Card>
  );
}