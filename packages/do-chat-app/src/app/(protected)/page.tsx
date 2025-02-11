"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { client } from "@/lib/api-client";

export default function Home() {
	const testDurableObject = async () => {
		try {
			console.log("Fetching messages...");
			const response = await client["chat-room"].create.$post();
			const data = await response.json();
			console.log("Messages:", data);
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Hello World!</CardTitle>
			</CardHeader>
			<CardContent>
				<p>This is a card</p>
				<Button onClick={testDurableObject}>Click me</Button>
			</CardContent>
		</Card>
	);
}
