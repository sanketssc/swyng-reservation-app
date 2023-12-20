"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Link2, Loader2 } from "lucide-react";
import Link from "next/link";

const t = [
  { name: "1:30 PM", value: (13 * 60 + 30) * 60 * 1000 },
  { name: "2:00 PM", value: 14 * 60 * 60 * 1000 },
  { name: "2:30 PM", value: (14 * 60 + 30) * 60 * 1000 },
  { name: "3:00 PM", value: 15 * 60 * 60 * 1000 },
  { name: "3:30 PM", value: (15 * 60 + 30) * 60 * 1000 },
  { name: "4:00 PM", value: 16 * 60 * 60 * 1000 },
  { name: "4:30 PM", value: (16 * 60 + 30) * 60 * 1000 },
  { name: "5:00 PM", value: 17 * 60 * 60 * 1000 },
  { name: "5:30 PM", value: (17 * 60 + 30) * 60 * 1000 },
  { name: "6:00 PM", value: 18 * 60 * 60 * 1000 },
  { name: "6:30 PM", value: (18 * 60 + 30) * 60 * 1000 },
];

const timeMap = {
  "13:30:00": (13 * 60 + 30) * 60 * 1000,
  "14:00:00": 14 * 60 * 60 * 1000,
  "14:30:00": (14 * 60 + 30) * 60 * 1000,
  "15:00:00": 15 * 60 * 60 * 1000,
  "15:30:00": (15 * 60 + 30) * 60 * 1000,
  "16:00:00": 16 * 60 * 60 * 1000,
  "16:30:00": (16 * 60 + 30) * 60 * 1000,
  "17:00:00": 17 * 60 * 60 * 1000,
  "17:30:00": (17 * 60 + 30) * 60 * 1000,
  "18:00:00": 18 * 60 * 60 * 1000,
  "18:30:00": (18 * 60 + 30) * 60 * 1000,
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [showTimes, setShowTimes] = React.useState<boolean>(false);
  const [bookedTimes, setBookedTimes] = React.useState<any[]>([]);
  const [times, setTimes] = React.useState<any[]>(t);
  const [loading, setLoading] = React.useState<number>(0);
  const [bookingLoading, setBookingLoading] = React.useState<boolean>(false);
  const router = useRouter();

  React.useEffect(() => {
    if (date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const date_string = `${year}-${month}-${day}`;
      const getBookedTimes = async () => {
        const res = await fetch(`/api/bookings?date=${date_string}`);
        const data = await res.json();
        setBookedTimes(data);
        setShowTimes(true);
      };
      getBookedTimes();
    } else {
      setShowTimes(false);
      setBookedTimes([]);
    }
    setTimes(t);
  }, [date]);

  React.useEffect(() => {
    setTimes((prev) =>
      prev.filter((time) => {
        return (
          (date?.valueOf() || 0) + time.value > Date.now() + 60 * 60 * 1000
        );
      })
    );
  }, [date]);

  React.useEffect(() => {
    bookedTimes.forEach((time) => {
      setTimes((prev) =>
        prev.filter((t) => {
          return t.value !== timeMap[time.time as keyof typeof timeMap];
        })
      );
    });
  }, [bookedTimes]);

  if (bookingLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 size={50} className="w-40 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen justify-center w-full  p-10">
      <Link href={"/bookings"} onClick={() => setBookingLoading(true)}>
        <Button variant={"ghost"} className="text-lg flex gap-2">
          <Link2 size={20} className="ml-2" />
          Bookings
        </Button>
      </Link>
      <div className="flex flex-col sm:flex-row items-center justify-center w-fit duration-1000 h-full md:h-4/5  px-5 py-20 rounded-lg ">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          fromDate={new Date()}
          toDate={
            new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)
          }
          disabled={(date: Date) => date.getDay() === 0 || date.getDay() === 6}
          modifiersClassNames={{
            today: "bg-slate-900 text-slate-50",
            disabled: "bg-slate-800/40 text-slate-400",
            outside: "bg-slate-800/40 text-slate-600",
          }}
          fixedWeeks={true}
          className=" p-5 "
          showOutsideDays={false}
        />
        {date &&
          (showTimes ? (
            <div className="h-3/5 md:h-full flex flex-col gap-2  items-center">
              <div>
                {date.getDate()}-{months[date.getMonth()]}-{date.getFullYear()}
              </div>
              <div className="flex flex-col overflow-auto h-full gap-1 px-10 py-1 ease-in-out">
                {times.length > 0 ? (
                  times.map((time, idx) => {
                    return (
                      <Button
                        key={idx}
                        variant="outline"
                        className="m-2 relative px-16 py-8"
                        size={"lg"}
                        onClick={() => {
                          setLoading(time.value);
                          router.push(
                            `/schedule?time=${date.valueOf() + time.value}`
                          );
                        }}
                        disabled={loading > 0}
                      >
                        {loading === time.value ? (
                          <Loader2
                            size={20}
                            className="w-20 absolute left-0 animate-spin"
                          />
                        ) : (
                          <></>
                        )}
                        {time.name}
                      </Button>
                    );
                  })
                ) : (
                  <div className="text-slate-500 px-9">No available slots</div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16">
              <Loader2 size={50} className="w-40 animate-spin" />
            </div>
          ))}
      </div>
    </div>
  );
}
