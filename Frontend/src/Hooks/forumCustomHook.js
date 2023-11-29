import { toast } from "react-toastify";
import axiosIntance from "../utils/axiosInstance";
import { useState } from "react";

const useForum = () => {
  const [discussion, setDiscussion] = useState([]);
  const getDiscussion = (courseId) => {
    axiosIntance(`/forum/get-discussion/${courseId}`)
      .then((res) => {
        setDiscussion(res.data.data);
      })
      .catch((err) => setDiscussion([]));
  };
  const createComment = (courseId, userId, comment) => {
    axiosIntance
      .post("/forum/create", { courseId, userId, comment })
      .then((res) => {
        toast.success("Comment is Successfully Added!");
        getDiscussion(courseId);
      })
      .catch((err) => toast.error("Failed to Add Comment!"));
  };
  const createReply = (courseId, discussionId, userId, comment) => {
    axiosIntance
      .post("/forum/reply", { discussionId, userId, comment })
      .then((res) => {
        toast.success("Reply Comment is Successfully Added!");
        getDiscussion(courseId);
      })
      .catch((err) => toast.error("Failed to Add Reply!"));
  };
  const deleteComment = (courseId, commentId) => {
    axiosIntance
      .delete(`/forum/delete-comment/${commentId}`)
      .then((res) => {
        toast.success("Comment is Successfully Deleted!");
        getDiscussion(courseId);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to Delete Comment!");
      });
  };
  const deleteReply = (courseId, commentId, replyId) => {
    axiosIntance
      .delete(`/forum/delete-reply/${commentId}/${replyId}`)
      .then((res) => {
        toast.success("Reply Comment is Successfully Deleted!");
        getDiscussion(courseId);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to Delete Reply!");
      });
  };
  return {
    getDiscussion,
    createComment,
    createReply,
    deleteComment,
    deleteReply,
    discussion,
  };
};

export default useForum;
