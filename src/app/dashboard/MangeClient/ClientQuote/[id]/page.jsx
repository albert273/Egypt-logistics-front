"use client";
import TitleDash from "@/components/dashboard/titlePages/TitleDash";
import RequestsCard from "@/components/dashboard/quoteCard/RequestsCard";
import { fetchClientQuoteData } from "@/redux/slice/quotes";
import { Box, Typography, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = ({ params }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const ClientQuotes = useSelector((state) => state.Quotes.Quote);
  const { id } = params;

  useEffect(() => {
    dispatch(fetchClientQuoteData(id));
  }, [dispatch, id]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#dd3333" }} />
      </Box>
    );

  // Filter running and expiring quotes
  const runningQuotes = ClientQuotes.filter(
    (quote) => !quote.status.some((status) => status.isFinished)
  );

  const expiringQuotes = ClientQuotes.filter(
    (quote) => quote.status.some((status) => status.isFinished)
  );

  return (
    <Box>
      <TitleDash title={"Client Quotes"} subTitle={"Client Quotes only"} />

      {/* Running Quotes */}
      <Typography sx={{ fontWeight: "bold", color: "#dd3333",fontSize: "1.2rem", mb: "30px" }}>
        Quotes in Progress
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          justifyItems: "center",
          alignItems: "center",
          gap: 2,
          pb: "40px",
        }}
      >
        {runningQuotes.map((item) => (
          <RequestsCard
            key={item.id}
            createdAt={new Date(item.createdAt).toLocaleDateString()}
            importingCountry={item.importingCountry}
            exportingCountry={item.exportingCountry}
            name={item.name}
            email={item.email}
            phoneNumber={item.phoneNumber}
            id={item.id}
            status={item.status}
            finishedAt={"N/A"}
          />
        ))}
      </Box>

      {/* Expiring Quotes */}
      <Typography sx={{ fontWeight: "bold", color: "#dd3333",fontSize: "1.2rem", mb: "30px" }}>
        Finished Quotes
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          justifyItems: "center",
          alignItems: "center",
          gap: 2,
          pb: "40px",
        }}
      >
        {expiringQuotes.map((item) => {
          const finishedAt = item.status.find((status) => status.isFinished)
            ?.finishedAt;

          return (
            <RequestsCard
              key={item.id}
              createdAt={new Date(item.createdAt).toLocaleDateString()}
              importingCountry={item.importingCountry}
              exportingCountry={item.exportingCountry}
              name={item.name}
              email={item.email}
              phoneNumber={item.phoneNumber}
              id={item.id}
              status={item.status}
              finishedAt={finishedAt ? new Date(finishedAt).toLocaleDateString() : "N/A"}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Page;
