import fastify from "fastify";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../env";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { prismaService } from "../lib/prisma";

const app = fastify();
app.get("/healt", () => {
  return "I'm Alive!";
});

app.post("/uploads", async (request) => {
  const uploadBodySchema = z.object({
    name: z.string().min(1),
    contentType: z.string().regex(/\w+\/[-+.\w]+/),
  });

  const { name, contentType } = uploadBodySchema.parse(request.body);
  const fileKey = randomUUID().concat("-").concat(name);

  const signedUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: "worm-hole-dev",
      Key: fileKey,
      ContentType: contentType,
    }),
    { expiresIn: 600 }
  );

  const file = await prismaService.file.create({
    data: {
      name: name,
      content_type: contentType,
      key: fileKey,
    },
  });

  return { signedUrl, fileId: file.id };
});

app.get("/uploads/:id", async (req, response) => {
  const getFileParamsSchema = z.object({
    id: z.string().cuid(),
  });

  const { id } = getFileParamsSchema.parse(req.params);

  const file = await prismaService.file.findUniqueOrThrow({
    where: { id },
  });

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: "worm-hole-dev",
      Key: file.key,
    }),
    { expiresIn: 600 }
  );

  return { signedUrl };
});

app
  .listen({
    port: parseInt(env.APP_PORT),
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`Http server running on port ${env.APP_PORT}... 🚀`);
  });
