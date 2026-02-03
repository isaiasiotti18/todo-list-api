import "dotenv/config";
import app from "./app";

const PORT = parseInt(`${process.env.PORT || 3005}`);

app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));
