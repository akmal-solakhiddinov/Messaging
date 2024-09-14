import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import useEditUser from "@/hooks/useEditUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Validation schema
const userSchema = z.object({
    fullName: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
    account: z.enum(['private', 'public']).optional(),
    image: z.union([z.string(), z.instanceof(FileList)]).optional(),
});

type Schema = z.infer<typeof userSchema>;

const EditUser = () => {
    const { user } = useAuth();
    const { editUser, } = useEditUser()

    const { handleSubmit, register, formState: { isSubmitting } } = useForm<Schema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: user?.fullName,
            username: user?.username,
            email: user?.email,
            account: user?.account,
            image: '',
        },
    });

    const onSubmit = async (data: Schema) => {
        try {
            const formData = new FormData();

            if (data.fullName) formData.append('fullName', data.fullName);
            if (data.username) formData.append('username', data.username);
            if (data.email) formData.append('email', data.email);
            console.log(data.account, user?.account)
            if (data.account && data.account !== user?.account) {
                formData.append('account', data.account);
            }


            if (data.image && data.image instanceof FileList && data.image.length > 0) {
                const image = data.image[0];
                formData.append('image', image);
            }


            console.log(data)
            console.log([...formData.entries()])

            editUser(formData)
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };



    return (
        <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-md">
                <input
                    type="text"
                    {...register('fullName')}
                    placeholder="Your Full Name"
                    className="p-2 bg-slate-100 rounded-sm font-medium"
                    defaultValue={user?.fullName}
                />
                <input
                    type="text"
                    {...register('username')}
                    placeholder="Your Username"
                    className="p-2 bg-slate-100 rounded-sm font-medium"
                    defaultValue={user?.username}
                />
                <input
                    type="email"
                    {...register('email')}
                    placeholder="Your Email"
                    className="p-2 bg-slate-100 rounded-sm font-medium"
                    defaultValue={user?.email}
                />
                <select {...register('account')} className="p-2 bg-slate-100 rounded-sm font-medium" >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <input
                    type="file"
                    {...register('image')}
                    className="p-2 bg-slate-100 rounded-sm font-medium"
                    accept="image/*"
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
        </div>
    );
};

export default EditUser;
