import React from "react";

export function stripHtml(html: string): string {
  if (!html) return "";

  const div = document.createElement("div");
  div.innerHTML = html;

  return (div.textContent || div.innerText || "")
    .replace(/\n/g, "<br>")
    .replace(/\s+/g, " ")
    .trim();
}

export function getS3PublicUrl(path: string): string {
  if (!path || !process.env.NEXT_PUBLIC_S3URL) return "";
  return `${process.env.NEXT_PUBLIC_S3URL}/${path}`;
}

/**
 *
 * @param date
 * @returns YYYY/MM/DD HH:MM:SS
 * note: if digit is no enough in each part, it will be filled with 0
 */
export function convertAWSDate2Datetime(date: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();
  return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  // return new Date(date).toLocaleString();
}

/**
 *
 * @param email info@example.com
 * @returns <p>info</p>at<p>example.com</p></li>
 */
export function convertEmail2SafeHtml(email: string): string {
  try {
    const [name, domain] = email.split("@");
    return `<p>${name}</p><p>at</p><p>${domain}</p>`;
  } catch (error) {
    return "";
  }
}
