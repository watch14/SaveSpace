import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";
import { getDocs, collection } from "firebase/firestore";
import Loading from "./ui/loader";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Category() {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryRef = collection(db, "category");

  const getCategories = async () => {
    try {
      const data = await getDocs(categoryRef);
      const categoryList = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);
      console.log("Categories: ", categoryList);

      // Filter categories based on the current user's ID
      const userFilteredCategories = categoryList.filter(
        (category) => category.createdBy === currentUser?.uid
      );

      setUserCategories(userFilteredCategories);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  if (loading) {
    return <Loading />; // Return loading component when loading is true
  }

  return (
    <div>
      {userCategories.length > 0 ? (
        userCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              Number of tasks: {category.tasks?.length || 0}
              <p>im gonna add more stuf here later</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        ))
      ) : (
        <>
          <p>
            You have no Catetegory.
            <br />
            Create a new category to get started.
          </p>
          <Button>Create Category</Button>
        </>
      )}
    </div>
  );
}
