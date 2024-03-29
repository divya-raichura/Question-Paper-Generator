import { FC, useEffect, useState } from "react";
import DisplayQuestions from "../../../components/questions/DisplayQuestions";
import QuestionHeader from "../../../components/questions/QuestionHeader";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import { useAuth } from "../../../firebase/contexts/AuthContext";
import { supabase } from "../../../supabase/supabaseClient";
import {
  SubjectQuestionJoin,
  User,
  QuestionAuthorJoin,
} from "../../../utils/types";
import { LayoutType } from "../../../utils/types";
import { PostgrestError } from "@supabase/supabase-js";
import { notifications } from "@mantine/notifications";
import { getSupabaseErrorMessage } from "../../../utils/getErrorMessage";
import { IconX } from "@tabler/icons-react";
import { useParams } from "react-router-dom";

interface QuestionProps {}

const Question: FC<QuestionProps> = ({}) => {
  const { currentUser } = useAuth();
  const [subjectsWithQuestions, setSubjectsWithQuestions] = useState<
    SubjectQuestionJoin[]
  >([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [layoutType, setLayoutType] = useState<LayoutType>(LayoutType.Grid);

  /**
   * toggle layout type
   */
  const toggleLayout = () => {
    setLayoutType(
      layoutType === LayoutType.Grid ? LayoutType.List : LayoutType.Grid
    );
  };

  /**
   * select question logic
   * */
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionAuthorJoin | null>(null);

  const handleBack = () => {
    setSelectedQuestion(null);
  };

  /**
   * fetch user, questions and subjects
   */

  const fetchUser_Questions_Subjects = async () => {
    setLoading(true);
    try {
      const { data: userDetails, error: userDetailsError } = await supabase
        .from("users")
        .select("*")
        .eq("email", currentUser?.email);

      if (userDetailsError) {
        throw userDetailsError;
      }

      if (!userDetails?.[0].id) {
        throw new Error("User not found");
      }

      const { data: subjectAndQuestionsData, error: subjectAndQuestionsError } =
        await supabase
          .from("subjects")
          .select("*, questions(*, author_id(email, username))")
          .eq("org_id", userDetails?.[0].org_id);

      if (subjectAndQuestionsError) {
        throw subjectAndQuestionsError;
      }

      setSubjectsWithQuestions(
        subjectAndQuestionsData as SubjectQuestionJoin[]
      );

      setUser(userDetails?.[0] as User);
    } catch (error: PostgrestError | any) {
      console.log("questions page fetch error", error);
      notifications.show({
        title: "Error!",
        message: getSupabaseErrorMessage(error),
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUser_Questions_Subjects();
    }
  }, [currentUser]);

  return (
    <>
      {!selectedQuestion && (
        <QuestionHeader
          toggleLayout={toggleLayout}
          subjectsWithQuestions={subjectsWithQuestions}
          user={user}
          fetchUser_Questions_Subjects={fetchUser_Questions_Subjects}
        />
      )}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <DisplayQuestions
          subjectsWithQuestions={subjectsWithQuestions}
          layoutType={layoutType}
          selectQuestion={{ selectedQuestion, setSelectedQuestion, handleBack }}
        />
      )}
    </>
  );

  /**
   * TODO: Implement pagination
   * TODO: Implement search
   * TODO: Implement filter
   * TODO: Implement sort
   * TODO: Implement loading state
   * TODO: Implement error state
   * TODO: Implement empty state
   * TODO: Implement question details
   */
};

export default Question;
