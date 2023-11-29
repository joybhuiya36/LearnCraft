import React, { useEffect, useState } from "react";
import useForum from "../../Hooks/forumCustomHook";
import { useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";

const Forum = ({ courseId, instructor }) => {
  const {
    getDiscussion,
    createComment,
    createReply,
    deleteComment,
    deleteReply,
    discussion,
  } = useForum();
  const [reply, setReply] = useState("");
  const userId = useSelector((state) => state.user.id);
  const role = useSelector((state) => state.user.role);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  useEffect(() => {
    getDiscussion(courseId);
  }, [discussion]);
  useEffect(() => {
    if (reply.length > 0) setReplyText("");
  }, [reply]);
  const timeConverter = (time) => {
    const convertedTime = new Date(time).toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    });
    return convertedTime;
  };
  const handleComment = () => {
    createComment(courseId, userId, commentText);
    setCommentText("");
  };
  const handleReply = () => {
    createReply(courseId, reply, userId, replyText);
    setReplyText("");
  };
  const handleCommentDelete = (commentId) => {
    deleteComment(courseId, commentId);
  };
  const handleReplyDelete = (replyId) => {
    deleteReply(courseId, reply, replyId);
  };
  return (
    <div className="mt-8 mx-[13em] w-full">
      {discussion?.map((comment) => (
        <div className="pb-1 mt-4 border-b-[1px] border-solid border-gray-200">
          <div>
            <div className="flex">
              <div className="flex-1">
                <div className="flex">
                  <img
                    src={comment?.userId?.avatar}
                    className="w-[30px] h-[30px] mr-2 rounded-full"
                  />
                  <p className="font-semibold flex-1">
                    {comment?.userId?.name}
                    {instructor == comment?.userId?._id && (
                      <p className="text-gray-400 text-sm mt-[-2px]">
                        Instructor
                      </p>
                    )}
                  </p>
                </div>
                <p className="ml-2">{comment?.comment}</p>
                <button
                  className="text-sm ml-2 text-blue-600"
                  onClick={() => setReply(comment?._id)}
                >
                  Reply
                </button>
              </div>
              <div>
                <p className="text-gray-500 text-sm">
                  {timeConverter(comment?.time)}
                </p>
                {userId == comment?.userId._id && (
                  <div className="flex justify-end">
                    <button onClick={() => handleCommentDelete(comment?._id)}>
                      <AiFillDelete className="text-xl mr-8 mt-2 hover:text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {reply == comment?._id && (
            <div>
              {comment?.reply?.map((reply) => (
                <div className="ml-10 mt-2 pt-2 border-t-[1px] border-solid border-gray-200">
                  <div className="flex">
                    <div className="flex-1">
                      <div className="flex">
                        <img
                          src={reply?.userId?.avatar}
                          className="w-[30px] h-[30px] mr-2 rounded-full"
                        />
                        <p className="font-semibold flex-1">
                          {reply?.userId?.name}
                          {instructor == reply?.userId?._id && (
                            <p className="text-gray-400 text-sm mt-[-2px]">
                              Instructor
                            </p>
                          )}
                        </p>
                      </div>
                      <p className="ml-2">{reply.comment}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">
                        {timeConverter(reply?.time)}
                      </p>
                      {userId == reply?.userId?._id && (
                        <div className="flex justify-end">
                          <button onClick={() => handleReplyDelete(reply._id)}>
                            <AiFillDelete className="text-xl mr-8 mt-2 hover:text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center">
                <textarea
                  className="border-[1px] border-gray-200 w-[50%] h-[4em] focus:outline-none"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <button
                  className="block mx-auto bg-blue-600 text-white py-1 hover:bg-blue-800 w-[50%]"
                  onClick={handleReply}
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="text-center">
        <textarea
          className="border-[1px] mt-4 border-gray-300 w-[100%] h-[6em] focus:outline-none"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <button
          className="block mx-auto mt-3 bg-blue-600 text-white py-1 hover:bg-blue-800 w-[100%]"
          onClick={handleComment}
        >
          Comment
        </button>
      </div>
    </div>
  );
};

export default Forum;
