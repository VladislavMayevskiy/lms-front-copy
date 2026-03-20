import UserLayout from "components/ui/layouts/user";
import {
  Box,
  Text,
  VStack,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
// import { SimpleGrid, Switch} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import Chevron from "assets/imgs/admin/modal/chevron.svg?react";
import Check from "assets/imgs/admin/modal/check.svg?react";
import { useState } from "react";
import { UserBox } from "components/ui/layouts/user";
import { authStore } from "stores/authStore";
import { settingsSchemaResolver } from "./validation/settings.schema";
import type { SettingsSchema } from "./validation/settings.schema";
import { useSaveSettings } from "api/user/settings/hooks";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "constants/languages";

function Settings() {
  const { t } = useTranslation();
  const [isLanguagesOpen, setIsLanguagesOpen] = useState(false);
  const [isPreferredLangOpen, setIsPreferredLangOpen] = useState(false);
  const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);

  const { mutate: saveSettings } = useSaveSettings();
  const user = authStore((store) => store.user);

  const timezones = Intl.supportedValuesOf("timeZone");
  const timezonesList = timezones.map((timezone) => ({
    label: timezone,
    value: timezone,
  }));

  const themesList = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  const toggleLanguages = () => setIsLanguagesOpen((prev) => !prev);
  const togglePreferredLang = () => setIsPreferredLangOpen((prev) => !prev);
  const toggleTimeZone = () => setIsTimeZoneOpen((prev) => !prev);
  const toggleMode = () => setIsModeOpen((prev) => !prev);

  const { control, handleSubmit } = useForm<SettingsSchema>({
    values: user
      ? {
          send_notifications: user.send_notifications,
          course_reminders: user.course_reminders,
          new_courses: user.new_courses,
          assignment_feedback: user.assignment_feedback,
          progress_updates: user.progress_updates,
          announcements: user.announcements,
          language: user.language,
          timezone: user.timezone,
          theme: user.theme,
          // Backend requires a non-null string. Fall back to the interface
          // language if the user has not set a course language preference yet.
          preferred_course_language:
            user.preferred_course_language || user.language || "en",
        }
      : {
          send_notifications: false,
          course_reminders: false,
          new_courses: false,
          assignment_feedback: false,
          progress_updates: false,
          announcements: false,
          language: "en",
          timezone: "Europe/London",
          theme: "light",
          preferred_course_language: "en",
        },
    resolver: settingsSchemaResolver,
  });

  const onSubmit = (formData: SettingsSchema) => {
    saveSettings(formData);
  };

  return (
    <UserLayout>
      <HStack spacing="15px" align="flex-start">
        <UserBox>
          <VStack
            fontFamily="Lato"
            spacing="35px"
            align="flex-start"
            w="100%"
            mt={"10px"}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            onChange={handleSubmit(onSubmit)}
          >
            {/* Notifications
            <VStack
              align="flex-start"
              width="100%"
              borderBottom="1px"
              borderColor="#B4D6DF"
              className="lms-subcard"
            >
              <Text
                mb="10px"
                textColor="#1F2221"
                fontWeight="bold"
                fontSize="20px"
                className="lms-muted"
              >
                {t("user.settings.notifications")}
              </Text>

              <SimpleGrid
                spacingX="350px"
                spacingY="20px"
                mb="30px"
                className="grid-cols-1 md:grid-cols-2"
              >
                <Controller
                  control={control}
                  name="send_notifications"
                  render={({ field: { value, onChange } }) => (
                    <HStack w="100%">
                      <Switch
                        checked={value}
                        defaultChecked={value}
                        onChange={onChange}
                        sx={{
                          "span.chakra-switch__track[data-checked]": {
                            bg: "#0070C1",
                          },
                        }}
                      />
                      <Text className="lms-muted">{t("user.settings.emailNotifications")}</Text>
                    </HStack>
                  )}
                />

                <Controller
                  control={control}
                  name="assignment_feedback"
                  render={({ field: { value, onChange } }) => (
                    <HStack w="100%">
                      <Switch
                        checked={value}
                        defaultChecked={value}
                        onChange={onChange}
                        sx={{
                          "span.chakra-switch__track[data-checked]": {
                            bg: "#0070C1",
                          },
                        }}
                      />
                      <Text className="lms-muted">{t("user.settings.assignmentFeedback")}</Text>
                    </HStack>
                  )}
                />

                <Controller
                  control={control}
                  name="course_reminders"
                  render={({ field: { value, onChange } }) => (
                    <HStack w="100%">
                      <Switch
                        checked={value}
                        defaultChecked={value}
                        onChange={onChange}
                        sx={{
                          "span.chakra-switch__track[data-checked]": {
                            bg: "#0070C1",
                          },
                        }}
                      />
                      <Text className="lms-muted">{t("user.settings.courseReminders")}</Text>
                    </HStack>
                  )}
                />

                <Controller
                  control={control}
                  name="progress_updates"
                  render={({ field: { value, onChange } }) => (
                    <HStack w="100%">
                      <Switch
                        checked={value}
                        defaultChecked={value}
                        onChange={onChange}
                        sx={{
                          "span.chakra-switch__track[data-checked]": {
                            bg: "#0070C1",
                          },
                        }}
                      />
                      <Text className="lms-muted">{t("user.settings.progressUpdates")}</Text>
                    </HStack>
                  )}
                />

                <Controller
                  control={control}
                  name="new_courses"
                  render={({ field: { value, onChange } }) => (
                    <HStack w="100%">
                      <Switch
                        checked={value}
                        defaultChecked={value}
                        onChange={onChange}
                        sx={{
                          "span.chakra-switch__track[data-checked]": {
                            bg: "#0070C1",
                          },
                        }}
                      />
                      <Text className="lms-muted">{t("user.settings.newCourses")}</Text>
                    </HStack>
                  )}
                />

                <Controller
                  control={control}
                  name="announcements"
                  render={({ field: { value, onChange } }) => (
                    <HStack w="100%">
                      <Switch
                        checked={value}
                        defaultChecked={value}
                        onChange={onChange}
                        sx={{
                          "span.chakra-switch__track[data-checked]": {
                            bg: "#0070C1",
                          },
                        }}
                      />
                      <Text className="lms-muted">{t("user.settings.announcements")}</Text>
                    </HStack>
                  )}
                />
              </SimpleGrid>
            </VStack> */}

            {/* Region & Language */}
            <VStack
              fontFamily="Lato"
              align="flex-start"
              width="100%"
              borderBottom="1px"
              borderColor="#B4D6DF"
              className="lms-subcard"
            >
              <Text
                mb="10px"
                textColor="#1F2221"
                fontWeight="bold"
                fontSize="20px"
                className="lms-muted"
              >
                {t("user.settings.regionAndLanguage")}
              </Text>

              <Box
                mb="30px"
                className="flex md:flex-row flex-col gap-2.5"
                w="100%"
              >
                <Controller
                  control={control}
                  name="language"
                  render={({ field: { value, onChange } }) => (
                    <VStack align="stretch" spacing="4px" position="relative">
                      <Text fontFamily="Lato" fontSize="14px" fontWeight="bold" className="lms-muted">
                        {t("user.settings.language")}
                      </Text>

                      <Box
                        borderWidth="1px"
                        borderRadius="10px"
                        borderColor="#B4D6DF"
                        bg="#F5F7F9"
                        className="lms-dark-input w-full md:w-[542px]"
                        minH="44px"
                        px="12px"
                        py="12px"
                        position="relative"
                        cursor="pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLanguages();
                        }}
                      >
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          gap="8px"
                          maxH="44px"
                          overflowY="auto"
                          pr="40px"
                        >
                          {!value && (
                            <Text
                              fontFamily="Lato"
                              fontSize="14px"
                              color="#0070C1"
                              py="4px"
                            >
                              {t("user.settings.selectLanguage")}
                            </Text>
                          )}

                          {value &&
                            (() => {
                              const language = SUPPORTED_LANGUAGES.find(
                                (l) => l.value === value
                              );
                              if (!language) return null;

                              return (
                                <Text
                                  fontFamily="Lato"
                                  fontSize="14px"
                                  color="#434645"
                                  whiteSpace="nowrap"
                                  className="lms-muted"
                                >
                                  {language.label}
                                </Text>
                              );
                            })()}
                        </Box>

                        <Box
                          position="absolute"
                          right="12px"
                          top="50%"
                          transform={
                            isLanguagesOpen
                              ? "translateY(-50%) rotate(180deg)"
                              : "translateY(-50%) rotate(0deg)"
                          }
                          transition="0.2s ease"
                        >
                          <Chevron />
                        </Box>
                      </Box>

                      {isLanguagesOpen && (
                        <Box
                          position="absolute"
                          top="78px"
                          left="0"
                          zIndex={100}
                          width="624px"
                          borderRadius="20px"
                          borderWidth="1px"
                          borderColor="#B4D6DF"
                          bg="white"
                          boxShadow="0 8px 25px rgba(0,0,0,0.15)"
                          py="10px"
                          px="22px"
                          minH="150px"
                          maxH="260px"
                          overflowY="auto"
                          className="lms-dark-panel"
                        >
                          <VStack align="stretch" spacing="4px">
                            {SUPPORTED_LANGUAGES.map((language) => (
                              <HStack key={language.value} spacing="8px">
                                <Checkbox
                                  isChecked={value === language.value}
                                  onChange={() => {
                                    onChange(language.value);
                                    toggleLanguages();
                                  }}
                                  icon={<Check />}
                                  sx={{
                                    ".chakra-checkbox__control": {
                                      borderRadius: "5px",
                                      borderColor: "#B4D6DF",
                                      width: "20px",
                                      height: "20px",
                                      borderWidth: "1px",
                                    },
                                  }}
                                />
                                <Text
                                  fontFamily="Lato"
                                  fontSize="16px"
                                  color="#434645"
                                  className="lms-muted"
                                >
                                  {language.label}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  )}
                />

                <Controller
                  control={control}
                  name="timezone"
                  render={({ field: { value, onChange } }) => (
                    <VStack
                      align="stretch"
                      spacing="4px"
                      position="relative"
                    >
                      <Text fontFamily="Lato" fontSize="14px" fontWeight="bold" className="lms-muted">
                        {t("user.settings.timeZone")}
                      </Text>

                      <Box
                        borderWidth="1px"
                        borderRadius="10px"
                        borderColor="#B4D6DF"
                        bg="#F5F7F9"
                        className="lms-dark-input w-full md:w-[542px]"
                        minH="44px"
                        px="12px"
                        py="12px"
                        position="relative"
                        cursor="pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTimeZone();
                        }}
                      >
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          gap="8px"
                          maxH="44px"
                          overflowY="auto"
                          pr="40px"
                        >
                          {!value && (
                            <Text
                              fontFamily="Lato"
                              fontSize="14px"
                              color="#0070C1"
                              py="4px"
                            >
                              {t("user.settings.selectTimeZone")}
                            </Text>
                          )}

                          {value &&
                            (() => {
                              const tz = timezonesList.find(
                                (t) => t.value === value
                              );
                              if (!tz) return null;

                              return (
                                <Text
                                  fontFamily="Lato"
                                  fontSize="14px"
                                  color="#434645"
                                  whiteSpace="nowrap"
                                  className="lms-muted"
                                >
                                  {tz.label}
                                </Text>
                              );
                            })()}
                        </Box>

                        <Box
                          position="absolute"
                          right="12px"
                          top="50%"
                          transform={
                            isTimeZoneOpen
                              ? "translateY(-50%) rotate(180deg)"
                              : "translateY(-50%) rotate(0deg)"
                          }
                          transition="0.2s ease"
                        >
                          <Chevron />
                        </Box>
                      </Box>

                      {isTimeZoneOpen && (
                        <Box
                          position="absolute"
                          top="78px"
                          left="0"
                          zIndex={100}
                          width="624px"
                          borderRadius="20px"
                          borderWidth="1px"
                          borderColor="#B4D6DF"
                          bg="white"
                          boxShadow="0 8px 25px rgba(0,0,0,0.15)"
                          py="10px"
                          px="22px"
                          minH="150px"
                          maxH="260px"
                          overflowY="auto"
                          className="lms-dark-panel"
                        >
                          <VStack align="stretch" spacing="4px">
                            {timezonesList.map((tz) => (
                              <HStack key={tz.value} spacing="8px">
                                <Checkbox
                                  isChecked={value === tz.value}
                                  onChange={() => {
                                    onChange(tz.value);
                                    toggleTimeZone();
                                  }}
                                  icon={<Check />}
                                  sx={{
                                    ".chakra-checkbox__control": {
                                      borderRadius: "5px",
                                      borderColor: "#B4D6DF",
                                      width: "20px",
                                      height: "20px",
                                      borderWidth: "1px",
                                    },
                                  }}
                                />
                                <Text
                                  fontFamily="Lato"
                                  fontSize="16px"
                                  color="#434645"
                                  className="lms-muted"
                                >
                                  {tz.label}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  )}
                />
              </Box>

              {/* ── Preferred Course Language ─────────────────────────────────────────
                  Separate from the UI/interface language.
                  Controls which language the user prefers for course content.
                  Uses the same SUPPORTED_LANGUAGES list as the interface language
                  selector — no extra API call required.
              ── */}
              <Box mb="30px" w="100%">
                <Controller
                  control={control}
                  name="preferred_course_language"
                  render={({ field: { value, onChange } }) => (
                    <VStack align="stretch" spacing="4px" position="relative">
                      <Text fontFamily="Lato" fontSize="14px" fontWeight="bold" className="lms-muted">
                        Preferred Course Language
                      </Text>

                      <Box
                        borderWidth="1px"
                        borderRadius="10px"
                        borderColor="#B4D6DF"
                        bg="#F5F7F9"
                        className="lms-dark-input w-full md:w-[542px]"
                        minH="44px"
                        px="12px"
                        py="12px"
                        position="relative"
                        cursor="pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePreferredLang();
                        }}
                      >
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          gap="8px"
                          maxH="44px"
                          overflowY="auto"
                          pr="40px"
                        >
                          {value &&
                            (() => {
                              const lang = SUPPORTED_LANGUAGES.find((l) => l.value === value);
                              if (!lang) return null;
                              return (
                                <Text
                                  fontFamily="Lato"
                                  fontSize="14px"
                                  color="#434645"
                                  whiteSpace="nowrap"
                                  className="lms-muted"
                                >
                                  {lang.label}
                                </Text>
                              );
                            })()}
                        </Box>

                        <Box
                          position="absolute"
                          right="12px"
                          top="50%"
                          transform={
                            isPreferredLangOpen
                              ? "translateY(-50%) rotate(180deg)"
                              : "translateY(-50%) rotate(0deg)"
                          }
                          transition="0.2s ease"
                        >
                          <Chevron />
                        </Box>
                      </Box>

                      {isPreferredLangOpen && (
                        <Box
                          position="absolute"
                          top="78px"
                          left="0"
                          zIndex={100}
                          width="624px"
                          borderRadius="20px"
                          borderWidth="1px"
                          borderColor="#B4D6DF"
                          bg="white"
                          boxShadow="0 8px 25px rgba(0,0,0,0.15)"
                          py="10px"
                          px="22px"
                          minH="150px"
                          maxH="260px"
                          overflowY="auto"
                          className="lms-dark-panel"
                        >
                          <VStack align="stretch" spacing="4px">
                            {SUPPORTED_LANGUAGES.map((lang) => (
                              <HStack key={lang.value} spacing="8px">
                                <Checkbox
                                  isChecked={value === lang.value}
                                  onChange={() => {
                                    onChange(lang.value);
                                    togglePreferredLang();
                                  }}
                                  icon={<Check />}
                                  sx={{
                                    ".chakra-checkbox__control": {
                                      borderRadius: "5px",
                                      borderColor: "#B4D6DF",
                                      width: "20px",
                                      height: "20px",
                                      borderWidth: "1px",
                                    },
                                  }}
                                />
                                <Text
                                  fontFamily="Lato"
                                  fontSize="16px"
                                  color="#434645"
                                  className="lms-muted"
                                >
                                  {lang.label}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  )}
                />
              </Box>
            </VStack>

            {/* Mode */}
            <Controller
              control={control}
              name="theme"
              render={({ field: { value, onChange } }) => (
                <VStack align="stretch" spacing="4px" position="relative" w="100%">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold" className="lms-muted">
                    {t("user.settings.mode")}
                  </Text>

                  <Box
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor="#B4D6DF"
                    bg="#F5F7F9"
                    className="lms-dark-input w-full md:w-[542px]"
                    minH="44px"
                    px="12px"
                    py="12px"
                    position="relative"
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMode();
                    }}
                  >
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      gap="8px"
                      maxH="44px"
                      overflowY="auto"
                      pr="40px"
                    >
                      {!value && (
                        <Text
                          fontFamily="Lato"
                          fontSize="14px"
                          color="#0070C1"
                          py="4px"
                        >
                          {t("user.settings.selectMode")}
                        </Text>
                      )}

                      {value &&
                        (() => {
                          const mode = themesList.find((m) => m.value === value);
                          if (!mode) return null;

                          return (
                            <Text
                              fontFamily="Lato"
                              fontSize="14px"
                              color="#434645"
                              whiteSpace="nowrap"
                              className="lms-muted"
                            >
                              {mode.label}
                            </Text>
                          );
                        })()}
                    </Box>

                    <Box
                      position="absolute"
                      right="12px"
                      top="50%"
                      transform={
                        isModeOpen
                          ? "translateY(-50%) rotate(180deg)"
                          : "translateY(-50%) rotate(0deg)"
                      }
                      transition="0.2s ease"
                    >
                      <Chevron />
                    </Box>
                  </Box>

                  {isModeOpen && (
                    <Box
                      position="absolute"
                      top="78px"
                      left="0"
                      zIndex={100}
                      width="624px"
                      borderRadius="20px"
                      borderWidth="1px"
                      borderColor="#B4D6DF"
                      bg="white"
                      boxShadow="0 8px 25px rgba(0,0,0,0.15)"
                      py="10px"
                      px="22px"
                      minH="150px"
                      maxH="260px"
                      overflowY="auto"
                      className="lms-dark-panel"
                    >
                      <VStack align="stretch" spacing="4px">
                        {themesList.map((mode) => (
                          <HStack key={mode.value} spacing="8px">
                            <Checkbox
                              isChecked={value === mode.value}
                              onChange={() => {
                                onChange(mode.value);
                                toggleMode();
                              }}
                              icon={<Check />}
                              sx={{
                                ".chakra-checkbox__control": {
                                  borderRadius: "5px",
                                  borderColor: "#B4D6DF",
                                  width: "20px",
                                  height: "20px",
                                  borderWidth: "1px",
                                },
                              }}
                            />
                            <Text
                              fontFamily="Lato"
                              fontSize="16px"
                              color="#434645"
                              className="lms-muted"
                            >
                              {mode.label}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </VStack>
              )}
            />
          </VStack>
        </UserBox>
      </HStack>
    </UserLayout>
  );
}

export default Settings;
