import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UploadImage } from "@/components/upload-image";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import {
  CheckboxGroupInput,
  EditButton,
  SaveContextProvider,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  required,
  useCreate,
} from "react-admin";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn, truncateTxt } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ChangelogCategory } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

export function changelogDescription(
  descriptions?: {
    description: string;
    description_details: string;
    hasImage: boolean;
  }[]
) {
  if (!descriptions) return "";
  return descriptions
    .map(description => {
      return `
      <div>
        <h4>${description.description}</h4>
        <p>${description.description_details}</p>
        ${
          description.hasImage
            ? `<strong>Check out the images</strong>`
            : "<div />"
        }
      </div>
      <br><br>`;
    })
    .join("")
    .trim();
}

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  description_detail: z.string(),
  categories: z.array(z.string()),
  images: z.array(
    z.object({
      imageUrl: z.string(),
      imageKey: z.string(),
    })
  ),
});

export const ChangelogCreate = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      description_detail: "",
      categories: [],
      images: [],
    },
  });

  const { control, handleSubmit } = form;

  const [create] = useCreate("changelog", { data: {} });

  const [images, setImages] =
    useState<{ imageUrl: string; imageKey: string }[]>();

  const [hasImage, setHasImage] = useState(false);
  const [featureEdit, setFeatureEdit] = useState<number | null>(null);

  const [features, setFeatures] = useState<
    {
      description: string;
      description_details: string;
      hasImage: boolean;
    }[]
  >([]);

  const onFeatureSave = (index?: number) => {
    let featuresWithEditOne: {
      description: string;
      description_details: string;
      hasImage: boolean;
    }[] = [];

    if (typeof index === "number" && index !== null) {
      featuresWithEditOne.push(
        ...features.map((feature, idx) =>
          idx === index
            ? {
                description: form.getValues("description"),
                description_details: form.getValues("description_detail"),
                hasImage,
              }
            : feature
        )
      );
    }

    setFeatures(f =>
      featuresWithEditOne.length > 0
        ? featuresWithEditOne
        : [
            ...(f || []),
            {
              description: form.getValues("description"),
              description_details: form.getValues("description_detail"),
              hasImage,
            },
          ]
    );

    form.setValue("description", "");
    form.setValue("description_detail", "");
    setHasImage(false);
  };

  const handleOnCompeteUpload = (
    res: { imageUrl: string; imageKey: string }[]
  ) => {
    setImages(imgs =>
      res.map(r => ({ imageUrl: r.imageUrl, imageKey: r.imageKey }))
    );
  };

  const categories = Object.values(ChangelogCategory).map(category => ({
    name: category,
    id: category,
  }));

  // Need to do it in this way to pass the images url to json body
  const onSave = async (data: any) => {
    data.images = images?.map(image => ({
      imageUrl: image.imageUrl,
      imageKey: image.imageKey,
    }));

    const description = changelogDescription(features);

    const changelog = {
      title: data.title,
      description,
      categories: data.categories,
      images: data.images,
    };

    await create("changelog", { data: changelog });
  };

  const onDeleteDescription = (index: number) => {
    setFeatures(features => features.filter((_, idx) => index != idx));
  };

  const onEditDescription = (index: number) => {
    setFeatureEdit(index);
    const description = features[index];
    form.setValue("description", description.description);
    form.setValue("description_detail", description.description_details);
    setHasImage(description.hasImage);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSave)} className="space-y-8">
        <div className="grid gap-x-2 gap-y-4">
          <div className="grid grid-cols-3 gap-x-3">
            {features?.map((feature, idx) => {
              return (
                <div
                  key={idx}
                  className="
                flex flex-col rounded-lg bg-zinc-300 p-2"
                >
                  <p className="w-fit">
                    {
                      truncateTxt({
                        text: feature.description,
                        nbChars: 25,
                      }).text
                    }
                  </p>
                  <div className="flex items-center gap-x-2 ml-auto mt-auto pt-2">
                    <button
                      onClick={() => {
                        onEditDescription(idx);
                      }}
                    >
                      <Edit className="size-4" />
                    </button>

                    <button
                      onClick={() => {
                        onDeleteDescription(idx);
                      }}
                    >
                      <Trash className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-y-2">
                    <Input
                      className="text-base bg-transparent"
                      placeholder="Title..."
                      {...field}
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-slate-100 rounded-md p-2 space-y-3">
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-y-2">
                      <Input
                        className="text-base bg-transparent"
                        placeholder="A description"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description_detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description details</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-y-2">
                      <Textarea
                        className="text-base bg-transparent"
                        placeholder="Description details..."
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-image"
                onCheckedChange={_check => setHasImage(prev => !prev)}
              />
              <label
                htmlFor="has-image"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Has Image
              </label>
            </div>
            <Button
              type="button"
              onClick={() => {
                featureEdit !== null
                  ? onFeatureSave(featureEdit)
                  : onFeatureSave();

                setFeatureEdit(null);
              }}
              className="w-full mt-2"
            >
              {featureEdit !== null ? "Update" : "Add"}
            </Button>
          </div>

          <SelectArrayInput source="categories" choices={categories} />
          <UploadImage
            onChange={handleOnCompeteUpload}
            endpoint="imageUploader"
            maxFiles={6}
          />

          <Button type="submit" className="w-full mt-2">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
