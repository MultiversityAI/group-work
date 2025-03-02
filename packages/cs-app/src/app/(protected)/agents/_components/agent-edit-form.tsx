"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/api-client";
import { AgentAvatarPicker } from "./agent-avatar-picker";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentSkeleton } from "@/app/(protected)/agents/_components/agent-skeleton";
import { AgentPlaceholderNotFound } from "@/app/(protected)/agents/_components/agent-placeholder";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	image: z.string().min(1, "Image is required"),
	systemPrompt: z.string().min(1, "System prompt is required"),
});

export type FormValues = z.infer<typeof formSchema>;

interface AgentEditFormProps {
	agentId: string;
}

export function AgentEditForm({ agentId }: AgentEditFormProps) {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const { data: agent, isLoading } = useQuery({
		queryKey: ["agent", agentId],
		queryFn: async () => {
			const response = await client.protected.agent[":id"].$get({
				param: { id: agentId },
			});
			return response.json();
		},
	});

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		values:
			agent && "name" in agent
				? {
						name: agent.name,
						image: agent.image,
						systemPrompt: agent.systemPrompt,
					}
				: {
						name: "",
						image: "",
						systemPrompt: "",
					},
	});

	const updateAgentMutation = useMutation({
		mutationFn: async (values: FormValues) => {
			const response = await client.protected.agent[":id"].$put({
				param: { id: agentId },
				json: values,
			});
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["agents"] });
			queryClient.invalidateQueries({ queryKey: ["agent", agentId] });
			toast({
				title: "Agent updated successfully",
			});
		},
	});

	const onSubmit = (values: FormValues) => {
		updateAgentMutation.mutate(values);
	};

	if (isLoading) {
		return <AgentSkeleton />;
	}

	if (!agent) {
		return <AgentPlaceholderNotFound />;
	}

	return (
		<div className="container mx-auto p-4">
			<Card>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Edit Agent</CardTitle>
							<Button type="submit" disabled={updateAgentMutation.isPending}>
								{updateAgentMutation.isPending ? "Saving..." : "Save Changes"}
							</Button>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input placeholder="Enter agent name" {...field} />
											</FormControl>
											<FormDescription>
												This is the name that will be displayed for your agent.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="systemPrompt"
									render={({ field }) => (
										<FormItem>
											<FormLabel>System Prompt</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Enter system prompt"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												This is the system prompt that will be used for your
												agent.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="rounded-lg border p-4">
									<AgentAvatarPicker control={form.control} />
								</div>
							</div>
						</CardContent>
					</form>
				</Form>
			</Card>
		</div>
	);
}
