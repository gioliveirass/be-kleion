-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL,
    "inventoryNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "objectType" TEXT NOT NULL,
    "material" TEXT,
    "period" TEXT,
    "date" TEXT,
    "culture" TEXT,
    "provenance" TEXT,
    "institution" TEXT,
    "imageUrl" TEXT,
    "externalSource" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artifact_inventoryNumber_key" ON "Artifact"("inventoryNumber");
