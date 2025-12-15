import { Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Checkbox } from "@fragment_ui/ui";

interface FormContainerProps {
  title?: string;
  description?: string;
  onSubmit?: (data: FormData) => void;
  children?: React.ReactNode;
}

export function FormContainer({
  title = "Form",
  description,
  onSubmit,
  children,
}: FormContainerProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        {description && (
          <p className="text-[color:var(--color-fg-muted)]">{description}</p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) {
            onSubmit(new FormData(e.currentTarget));
          }
        }}
        className="space-y-6"
      >
        {children || (
          <>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" name="name" required placeholder="Your name" />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                Country
              </label>
              <Select name="country">
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="pl">Poland</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" name="terms" required />
              <label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="solid">
                Submit
              </Button>
              <Button type="reset" variant="outline">
                Reset
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

