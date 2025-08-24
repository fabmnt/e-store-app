import { count, eq } from 'drizzle-orm';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import * as z from 'zod';
import { db } from '@/db';
import { productImage } from '@/db/schema';
import { auth } from '@/lib/auth';

export const MAX_IMAGES = 5;

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '4MB',
      maxFileCount: 5,
    },
  })
    .input(
      z.object({
        productId: z.string(),
        storeSlug: z.string(),
      })
    )
    .middleware(async ({ req, input, files }) => {
      // This code runs on your server before upload
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      // If you throw, the user will not be able to upload
      if (!session) {
        throw new UploadThingError('Unauthorized');
      }

      const [totalCurrentImages] = await db
        .select({ count: count() })
        .from(productImage)
        .where(eq(productImage.productId, input.productId));

      if (totalCurrentImages == null) {
        throw new UploadThingError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        });
      }

      const totalImages = totalCurrentImages.count + files.length;

      if (totalImages > MAX_IMAGES) {
        throw new UploadThingError({
          code: 'TOO_MANY_FILES',
          message: `Maximum number of images (${MAX_IMAGES}) will be reached if you upload ${files.length} more files`,
        });
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        userId: session.user.id,
        productId: input.productId,
        storeSlug: input.storeSlug,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await db.insert(productImage).values({
        productId: metadata.productId,
        url: file.ufsUrl,
        fileKey: file.key,
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
