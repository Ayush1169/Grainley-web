"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
const [user, setUser] = useState<any>(null);

useEffect(() => {
const data = localStorage.getItem("user");

if (data) {
  setUser(JSON.parse(data));
}


}, []);

return ( <div className="min-h-screen bg-black text-white p-10"> <h1 className="text-4xl font-bold">
Welcome {user?.name} </h1>

```
  <p className="mt-4">
    Email: {user?.email}
  </p>

  <p>
    Phone: {user?.phone}
  </p>
</div>


);
}
