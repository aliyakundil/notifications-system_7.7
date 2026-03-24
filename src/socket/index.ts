export function onConnection(io: any) {
  io.on("connection", (socket: any) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);

    console.log("User connected:", userId);

    socket.on("notification:ping", () => {
      socket.emit("notification:pong");
    });
  });
};