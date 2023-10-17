import { Box } from "@mui/material";
import {Url } from 'Url';

const UserImage= ({image, size='60px'})=>{
    return(
        <Box width={size} height={size}>
        <img
          style={{ objectFit: "cover", borderRadius: "50%" }}
          width={size}
          height={size}
          alt="user"
          src={`${Url}/assets/${image}`}
        />
      </Box>
    )
}

export default UserImage;