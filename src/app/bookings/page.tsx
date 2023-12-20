import sql from "@/lib/db";
import { ArrowLeft } from "lucide-react";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
};

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Bookings() {
  const res = await sql`SELECT * FROM bookings order by id desc`;
  const bookings: Booking[] = [];
  for (const booking of res) {
    const { id, name, email, phone, date, time } = booking;
    const d = new Date(date);
    const date_string = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    bookings.push({ id, name, email, phone, date: date_string, time });
  }

  return (
    <div className="max-w-screen-lg h-screen mx-auto pt-20">
      <Link href="/" className="absolute top-6">
        <Button variant="outline">
          <ArrowLeft className="mr-2" />
          Home
        </Button>
      </Link>
      <Table className="mx-auto w-full">
        <TableCaption>
          <div>A list of your Bookings.</div>
          <div className="contents md:hidden">
            Please view on desktop for other columns
          </div>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking, idx) => (
            <TableRow key={booking.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{booking.name}</TableCell>
              <TableCell className="hidden md:table-cell ">
                {booking.email}
              </TableCell>
              <TableCell className="hidden md:table-cell ">
                {booking.phone}
              </TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>{booking.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow></TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
