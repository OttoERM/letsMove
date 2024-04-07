const { hash } = require("bcrypt");
async function generatePass() {
  const AdminUser = await hash("AdminUser", 10);
  console.log(AdminUser);
  const Carl = await hash("Carl", 10);
  console.log(Carl);
  const Mary = await hash("Mary", 10);
  console.log(Mary);
  const Peter = await hash("Peter", 10);
  console.log(Peter);
  const Clayton = await hash("Clayton", 10);
  console.log(Clayton);
  const Rose = await hash("Rose", 10);
  console.log(Rose);
  const Amul = await hash("Amul", 10);
  console.log(Amul);
  const Jeison = await hash("Jeison", 10);
  console.log(Jeison);
  const Freddy = await hash("Freddy", 10);
  console.log(Freddy);
  const Sofia = await hash("Sofia", 10);
  console.log(Sofia);
}

generatePass();
