import {
	Box,
	Input,
	Heading,
	Text,
	Checkbox,
	Button,
	VStack,
	HStack,
} from "@chakra-ui/react";
import DownIcon from "assets/imgs/landing/Down.svg?react";
import StarYellow from "assets/imgs/landing/StarYellow.svg?react";

export default function Section5() {
	return (
		<Box 
			height={{ md: 888, base: "auto" }} 
			p={{ base: "60px 20px", md: 16 }} 
			mt={{ md: -200, base: "60px" }} 
			overflow="hidden" 
			position="relative"
			width="100%"
			maxW="100vw"
			id="contact-us-section"
		>
			<VStack gap="80px" width="100%" align="stretch">
				<VStack gap="16px" width="100%" px={{ base: "20px", md: 0 }}>
					<Heading 
						textAlign="center" 
						fontWeight="bold" 
						fontSize={{ md: 56, base: 32 }} 
						lineHeight="120%" 
						letterSpacing="-0.01em"
						sx={{
							overflowWrap: "anywhere",
							wordBreak: "break-word",
							hyphens: "auto"
						}}
					>
						Ready to chat?
					</Heading>
					<Text 
						lineHeight="150%" 
						letterSpacing="-0.01em" 
						fontSize={{ md: 18, base: 16 }} 
						maxW={{ base: "335px", md: "auto" }} 
						textAlign="center"
						sx={{
							overflowWrap: "anywhere",
							wordBreak: "break-word"
						}}
					>
						Leave us your contact information and we will respond in no time
					</Text>
				</VStack>

				<VStack 
					alignItems="center" 
					gap="24px" 
					width="100%" 
					maxW="560px" 
					mx="auto"
				>
					<VStack align={'center'} position="relative" width="100%" textAlign="left">
						<Text 
							color="#2C2C2C" 
							textAlign="left" 
							fontSize={16} 
							lineHeight="150%" 
							letterSpacing="-0.01em"
							width={'100%'}
							align={'start'}
						>
							Name
						</Text>
						<Input
							height="48px"
							width="100%"
							borderWidth={1}
							borderColor="#2C2C2C"
							borderRadius={12}
							bgColor="rgba(255, 255, 255, 0.1)"
							backdropFilter="blur(4px)"
						/>
					</VStack>

					<VStack align={'center'} position="relative" width="100%">
						<Text 
							color="#2C2C2C" 
							textAlign="left" 
							fontSize={16} 
							lineHeight="150%" 
							letterSpacing="-0.01em"
							width={'100%'}
							align={'start'}
						>
							Email
						</Text>
						<Input
							height="48px"
							width="100%"
							borderWidth={1}
							borderColor="#2C2C2C"
							borderRadius={12}
							bgColor="rgba(255, 255, 255, 0.1)"
							backdropFilter="blur(4px)"
						/>
					</VStack>

					<VStack align={'center'} position="relative" width="100%">
						<Text 
							color="#2C2C2C" 
							textAlign="left" 
							fontSize={16} 
							lineHeight="150%" 
							letterSpacing="-0.01em"
							width={'100%'}
							align={'start'}
						>
							Message
						</Text>
						<Input
							height="121px"
							width="100%"
							borderWidth={1}
							borderColor="#2C2C2C"
							borderRadius={12}
							bgColor="rgba(255, 255, 255, 0.1)"
							backdropFilter="blur(4px)"
							as="textarea"
						/>
					</VStack>
					
					<HStack flexWrap="wrap">
						<Checkbox
							flexShrink={0}
							sx={{
								"& .chakra-checkbox__control": {
									border: "1px solid #2C2C2C",
									borderRadius: "2px",
								},
								"& .chakra-checkbox__control[data-checked]": {
									bg: "#000000",
									borderColor: "#000000",
								},
								"& .chakra-checkbox__control[data-checked] svg": {
									color: "white",
								}
							}}
						/>
						<Text 
							fontSize={14} 
							lineHeight="150%" 
							letterSpacing="-0.01em"
							sx={{
								overflowWrap: "anywhere",
								wordBreak: "break-word"
							}}
						>
							I accept the <Text as="span" textColor="#2C2C2C" textDecoration="underline">Terms</Text>
						</Text>
					</HStack>

					<Box width="100%" display="flex" justifyContent="center">
						<Box 
							px="10px" 
							py="9px" 
							border="1px dashed #114FF0" 
							borderRadius="12px" 
							width="146px" 
							height="68px"
						>
							<Button
								_hover={{ bgColor: "#114FF0" }}
								bg="#114FF0"
								fontWeight="medium"
								rightIcon={<DownIcon style={{ transform: "rotate(-90deg)" }}/>}
								textColor="white"
								borderRadius="12px"
								fontSize={16}
								width="122px"
								height="48px"
								flexShrink={0}
							>
								Submit
							</Button>
						</Box>
					</Box>
				</VStack>
			</VStack>
			

			<StarYellow 
				style={{
					position: 'absolute',
					top: '570px',
					left: '-130px',
					zIndex: -1,
					pointerEvents: 'none'
				}}
				className="md:top-[450px] md:left-[-150px]"
			/>
		</Box>
	);
};