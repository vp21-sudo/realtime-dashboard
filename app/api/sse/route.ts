// app/api/sse/route.ts
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

// Utility function to generate a random number between min and max
const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export async function GET(request: NextRequest) {
  // Set SSE headers
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let isClosed = false; // Flag to track if the stream is closed
  let timeoutId: NodeJS.Timeout; // To store the timeout ID

  // Create a ReadableStream to handle SSE
  const stream = new ReadableStream({
    start(controller) {
      // Function to send SSE formatted messages
      const sendSSE = (event: string, data: string) => {
        if (isClosed) return; // Prevent enqueueing if the stream is closed
        try {
          controller.enqueue(`event: ${event}\n`);
          controller.enqueue(`data: ${data}\n\n`);
        } catch (error) {
          console.error("Error enqueuing data:", error);
        }
      };

      // Send an initial connection message
      sendSSE("connected", "Connected to SSE endpoint");

      // Function to send updates at random intervals
      const sendUpdates = () => {
        if (isClosed) return; // Exit if the stream is closed

        const payload = [
          {
            month: "January",
            desktop: getRandomNumber(500, 5000),
            mobile: getRandomNumber(500, 5000),
          },
          {
            month: "February",
            desktop: getRandomNumber(500, 5000),
            mobile: getRandomNumber(500, 5000),
          },
          {
            month: "March",
            desktop: getRandomNumber(500, 5000),
            mobile: getRandomNumber(500, 5000),
          },
          {
            month: "April",
            desktop: getRandomNumber(500, 5000),
            mobile: getRandomNumber(500, 5000),
          },
          {
            month: "May",
            desktop: getRandomNumber(500, 5000),
            mobile: getRandomNumber(500, 5000),
          },
          {
            month: "June",
            desktop: getRandomNumber(500, 5000),
            mobile: getRandomNumber(500, 5000),
          },
        ];

        sendSSE("update", JSON.stringify(payload));

        // Schedule the next update with a random delay between 0.5s and 5s
        const randomDelay = getRandomNumber(500, 5000);
        timeoutId = setTimeout(sendUpdates, randomDelay);
      };

      // Start sending updates
      sendUpdates();

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        console.log("Client disconnected from SSE");
        isClosed = true; // Update the flag
        clearTimeout(timeoutId); // Clear any pending timeouts
        controller.close(); // Close the stream
      });
    },
    cancel() {
      // Cleanup when the stream is canceled
      isClosed = true;
      clearTimeout(timeoutId);
      console.log("Stream canceled");
    },
  });

  return new Response(stream, { headers });
}
