import { users } from "@/app/util/db";
import { NextResponse } from "next/server";
import fs from "fs";

//2. Get specific user

export async function GET(_, res) {
  const { id } = await res.params;
  const user = users.filter((user) => user.id === id);
  return NextResponse.json({ user });
}

//3. Login

export async function POST(req, res) {
  const { name, email, password } = await req.json();
  const { id } = await res.params;

  const {
    name: userName,
    email: userEmail,
    password: userPassword,
  } = users.find((user) => user.id === id);

  if (userName === name && userEmail === email && userPassword === password) {
    return NextResponse.json({ result: "success" });
  } else if (!name || !email || !password) {
    return NextResponse.json({ result: "please fill out all fields" });
  } else {
    return NextResponse.json({ result: "invalid credentials" });
  }
}

//6. Delete User

export async function DELETE(req, res) {
  const { id } = await res.params;

  //Find the index of the user to delete in the users array
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ result: "User not found" }, { status: 404 });
  }

  //Remove the user from the users array
  users.splice(userIndex, 1);

  //Update the users array in the db.js file
  updateUserData();

  return NextResponse.json({ result: "User deleted successfully" });
}

function updateUserData() {
  const updatedUsersArray = users;
  const updatedData = JSON.stringify(updatedUsersArray, null, 2);
  fs.writeFileSync(
    "./app/util/db.js",
    `export const users = ${updatedData};`,
    "utf-8"
  );
}
