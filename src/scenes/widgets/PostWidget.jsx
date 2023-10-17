import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme ,InputBase, Button} from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Friend from "components/Friend";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts,setPost } from "state";
  import Comment from "components/Comment";
  import {Url } from 'Url.js'
  
  const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
  }) => {
    const [isComments, setIsComments] = useState(false);
    const [comment , setComment] = useState("");
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      const response = await fetch(`${Url}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    };

    const handleComment = async() => {
      const response = await fetch(`${Url}/posts/${postId}/${loggedInUserId}/comment`,{
        method:"POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: comment }), 
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setComment("");
    };

    const handleDeletePost = async() =>{
      const response = await fetch(`${Url}/posts/${postId}/delete`,{
        method:"PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }        
      });
      const posts = await response.json();
      dispatch(setPosts({ posts }));
    }

  
    return (
      <WidgetWrapper m="2rem 0">
        <Friend
          pf={loggedInUserId}
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
          
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`${Url}/assets/${picturePath}`}
          />
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          <FlexBetween gap="0.3rem" >
              {loggedInUserId===postUserId && <Typography onClick={handleDeletePost} style={{cursor:"pointer"}}>Delete</Typography>}
              <IconButton>
                  <ShareOutlined />
              </IconButton>
            </FlexBetween>

        </FlexBetween>


        {isComments && (
          <Box mt="0.5rem">
             {comments.slice(0).reverse().map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Comment userId={comment.userId} comment={comment.comment} postId={postId}/>
              </Box>
            ))}
            <Divider />
            <FlexBetween>
            <InputBase
            placeholder="Write a comment ..."
            onChange={(e)=>setComment(e.target.value)}
            value={comment}           
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
              mt:"1rem"
            }}
          />
          <Button
            disabled={!comment}
            onClick={handleComment}
            sx={{
              color: palette.background.alt,
              mt:"1rem",
              ml:"0.5rem",
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              "&:hover":{
                cursor:"pointer",
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
              }
            }}
          >
            POST
          </Button>
            </FlexBetween>

          </Box>
        )}
      </WidgetWrapper>
    );
  };
  
  export default PostWidget;