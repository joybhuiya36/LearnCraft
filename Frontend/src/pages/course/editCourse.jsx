import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosIntance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DropBox from "../../components/icons/dropBox";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  desc: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  level: yup.string().required("Level is required"),
  preRequisite: yup.string().required("Prerequisite is required"),
});

const EditCourse = () => {
  const location = useLocation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileErr, setFileErr] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      title: location.state.title,
      desc: location.state.desc,
      category: location.state.category,
      level: location.state.level,
      preRequisite: location.state.preRequisite,
    },
  });

  const onSubmit = async (data) => {
    console.log(file);
    // return;
    try {
      if (data.title.trim() == "") {
        toast.error("Title Can't be Empty!");
        return;
      }
      if (data.desc.trim() == "") {
        toast.error("Description Can't be Empty!");
        return;
      }
      if (data.category.trim() == "") {
        console.log("No");
        toast.error("Category Can't be Empty!");
        return;
      }
      if (data.preRequisite.trim() == "") {
        console.log("No");
        toast.error("Pre-Requisite Can't be Empty!");
        return;
      }
      const formData = new FormData();
      formData.append("courseId", courseId);
      formData.append("title", data.title.trim());
      formData.append("desc", data.desc.trim());
      formData.append("category", data.category.trim());
      formData.append("level", data.level);
      formData.append("preRequisite", data.preRequisite.trim());
      if (file) formData.append("thumbnail", file);
      setLoading(true);

      axiosIntance
        .patch("/course/edit", formData)
        .then((res) => {
          console.log("Updated");
          navigate(`/course/${courseId}`);
          toast("Course is Successfully Updated!");
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast("Failed to Update Course!");
          setLoading(false);
        });
    } catch (error) {}
  };
  const handleFile = (imgFile) => {
    setFile(imgFile);
    setFileErr("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-md shadow-md p-8">
      <h2 className="text-2xl font-semibold mb-4">Update a Course</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Title:
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
              />
            )}
          />
          <p className="text-red-500 text-xs mt-1">{errors.title?.message}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Description:
          </label>
          <Controller
            name="desc"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="mt-1 p-2 w-full h-[30vh] border rounded-md"
              />
            )}
          />
          <p className="text-red-500 text-xs mt-1">{errors.desc?.message}</p>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-600">
              Category:
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              )}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.category?.message}
            </p>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-600">
              Level:
            </label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  <option value="" disabled>
                    Select Level
                  </option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              )}
            />
            <p className="text-red-500 text-xs mt-1">{errors.level?.message}</p>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Prerequisite:
          </label>
          <Controller
            name="preRequisite"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
              />
            )}
          />
          <p className="text-red-500 text-xs mt-1">
            {errors.preRequisite?.message}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Thumbnail:
          </label>
          <div className="flex justify-center">
            <DropBox fileType={"image/"} callBackFunc={handleFile} />
          </div>
          <p className="text-red-500 text-xs mt-1">
            {fileErr.length > 0 && fileErr}
          </p>
        </div>
        {file && (
          <img
            src={URL.createObjectURL(file)}
            className="mb-4 border-[1px] border-dashed mx-auto border-gray-600 p-2"
          />
        )}
        <button
          type="submit"
          className="bg-[#0689b6] text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
        >
          {loading ? "Updating..." : "Update Course"}
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
