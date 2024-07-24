import fastify from "fastify"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../env";

const app = fastify()
app.get('/healt', () => {
  return "I'm Alive!"
});

app.post('/upload', async () => {
  const signedUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: "up-it-dev",
      Key: "file.mp4",
      ContentType: 'video/mp4',
    }),
    { expiresIn: 600 }
  )
  return signedUrl;
});


app.listen({
  port:  parseInt(env.APP_PORT),
  host: "0.0.0.0"
}).then(() => {
  console.log(`Http server running on port ${env.APP_PORT}... 🚀`)
});