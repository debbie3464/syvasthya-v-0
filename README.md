/**
 * rolePermissions.js
 * Centralizes all role-based access control for Syvasthya.
 * Frontend-only enforcement — no backend involved.
 */

/**
 * Can a user create a new post?
 * Both doctors and patients can create posts.
 */
export const canCreatePost = (user) => !!user;

/**
 * Can a user comment on a post?
 * RULE: Only doctors can comment on patient posts.
 * Doctors can also comment on other doctor posts.
 */
export const canComment = (user, post) => {
  if (!user || !post) return false;
  // Doctors can comment on any post
  if (user.role === "doctor") return true;
  // Patients CANNOT comment on any post
  return false;
};

/**
 * Can a user view the comment input box?
 * Same as canComment — the box is hidden for patients.
 */
export const canViewCommentInput = (user) => {
  return user?.role === "doctor";
};

/**
 * Can a doctor see the medical info hover card for a patient?
 * Only doctors see the hover card, and only on non-anonymous posts.
 */
export const canViewMedicalHoverCard = (viewerUser, postAuthor) => {
  if (!viewerUser || viewerUser.role !== "doctor") return false;
  if (!postAuthor) return false;
  // Anonymous patients hide their card from everyone
  if (postAuthor.isAnonymous) return false;
  // Doctors can hover any non-anonymous patient
  return postAuthor.role === "patient";
};

/**
 * Should identity (name, avatar, medical details) be hidden for this post?
 */
export const isIdentityHidden = (post, postAuthor) => {
  // Use post-level flag first (set at create time), then fallback to user default
  if (post?.isAnonymous !== undefined) return post.isAnonymous;
  return postAuthor?.isAnonymous ?? false;
};

/**
 * Can a user access the Doctor Dashboard?
 */
export const canAccessDoctorDashboard = (user) => user?.role === "doctor";

/**
 * Can a user see the Book Tests option in nav?
 * Patients only — doctors should not see "Book Tests" per requirements.
 */
export const canBookTests = (user) => user?.role === "patient";

/**
 * What post type should a new post be created as?
 */
export const getPostType = (user) => {
  return user?.role === "doctor" ? "doctor_post" : "patient_post";
};

/**
 * Friendly role label
 */
export const getRoleLabel = (user) => {
  if (!user) return "Guest";
  return user.role === "doctor" ? `Dr. · ${user.specialty || "Doctor"}` : "Patient";
};
