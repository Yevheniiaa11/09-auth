"use client";
import Image from "next/image";
import css from "./ProfilePage.module.css";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../../lib/store/authStore";
import { UpdateUserRequest, updateMe } from "../../../../lib/api/clientApi";

const EditProfile = () => {
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const username = String(formData.get("username") || "").trim();
    if (!username) {
      setError("Username is required");
      return;
    }

    if (user) {
      const updatePayload: UpdateUserRequest = {
        userName: username,
      };

      try {
        const response = await updateMe(updatePayload);
        setUser(response);
        console.log("User edit:", response);

        router.push("/profile");
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user?.photoUrl || "/default-avatar.jpg"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}
          className={css.profileInfo}
        >
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              id="username"
              type="text"
              defaultValue={user?.userName}
            />
          </div>

          <p>{user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              onClick={() => router.push("/profile")}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>

        {error && <p className={css.error}>{error}</p>}
      </div>
    </main>
  );
};

export default EditProfile;
