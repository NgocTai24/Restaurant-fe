import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"

interface IUser {
    _id: string;
    name: string;
    email: string;
    access_token: string;
}
interface Category {
    _id?: string;
    name: string;
    image: string;
}

interface Subcategory {
  _id?: string;
  name: string;
  category: string; // ObjectId dưới dạng string
}

interface MenuItem {
  _id?: string;
  name: string;
  subcategory: string;
  price: number;
  image: string;
  isAvailable?: boolean;
  description?: string;
}

interface UpdateMenuItemDto {
  name?: string;
  subcategory?: string;
  price?: number;
  image?: string;
  isAvailable?: boolean;
  description?: string;
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        access_token: string;
        refresh_token: string;
        user: IUser;
        access_expire: number;
        error: string;
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: IUser,
        access_token: string;
        refresh_token: string;
        access_expire: number;
        error: string;
    }


}