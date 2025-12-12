import axios from "axios";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import { env } from "../../../utils/enviroment";

const personaHTTPRepository = {};
const context = "Persona HTTP Repository";

// Persona API configuration
const PERSONA_API_BASE_URL =
  env.PERSONA_API_URL || "https://withpersona.com/api/v1";
const PERSONA_API_KEY = env.PERSONA_API_KEY;
const PERSONA_INQUIRY_TEMPLATE_ID = env.PERSONA_INQUIRY_TEMPLATE_ID;

/**
 * Create a new inquiry in Persona
 * @param {string} referenceId - Your internal user ID (email_user or id_user)
 * @param {Object} userData - Additional user data to include in the inquiry
 * @returns {Promise<Object>} - Returns inquiry object with inquiryId
 */
personaHTTPRepository.createInquiry = async (referenceId, userData = {}) => {
  try {
    logger.info(
      `[${context}]: Creating Persona inquiry for reference: ${referenceId}`
    );
    ObjLog.log(
      `[${context}]: Creating Persona inquiry for reference: ${referenceId}`
    );

    // Validate required configuration
    if (!PERSONA_API_KEY) {
      throw new Error(
        "PERSONA_API_KEY is not configured in environment variables"
      );
    }
    if (!PERSONA_INQUIRY_TEMPLATE_ID) {
      throw new Error(
        "PERSONA_INQUIRY_TEMPLATE_ID is not configured in environment variables"
      );
    }

    logger.info(`[${context}]: Using Persona API URL: ${PERSONA_API_BASE_URL}`);
    logger.info(
      `[${context}]: API Key configured: ${
        PERSONA_API_KEY
          ? "Yes (key starts with: " + PERSONA_API_KEY.substring(0, 20) + "...)"
          : "No"
      }`
    );
    logger.info(`[${context}]: Template ID: ${PERSONA_INQUIRY_TEMPLATE_ID}`);

    const requestBody = {
      data: {
        type: "inquiry",
        attributes: {
          "inquiry-template-id": PERSONA_INQUIRY_TEMPLATE_ID,
          "reference-id": referenceId,
        },
      },
    };

    // Add optional user data if provided
    if (userData.email) {
      requestBody.data.attributes.fields = {
        ...requestBody.data.attributes.fields,
        "email-address": { type: "string", value: userData.email },
      };
    }

    if (userData.name) {
      requestBody.data.attributes.fields = {
        ...requestBody.data.attributes.fields,
        "name-first": { type: "string", value: userData.name.split(" ")[0] },
        "name-last": {
          type: "string",
          value:
            userData.name.split(" ").slice(1).join(" ") ||
            userData.name.split(" ")[0],
        },
      };
    }

    const response = await axios.post(
      `${PERSONA_API_BASE_URL}/inquiries`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${PERSONA_API_KEY}`,
          "Content-Type": "application/json",
          "Persona-Version": "2023-01-05",
        },
      }
    );

    logger.info(
      `[${context}]: Inquiry created successfully - ID: ${response.data.data.id}`
    );
    ObjLog.log(
      `[${context}]: Inquiry created successfully - ID: ${response.data.data.id}`
    );

    return {
      inquiryId: response.data.data.id,
      status: response.data.data.attributes.status,
      referenceId: response.data.data.attributes["reference-id"],
      fullResponse: response.data,
    };
  } catch (error) {
    logger.error(
      `[${context}]: Error creating Persona inquiry: ${error.message}`
    );
    ObjLog.log(
      `[${context}]: Error creating Persona inquiry: ${error.message}`
    );

    if (error.response) {
      logger.error(
        `[${context}]: Persona API error response: ${JSON.stringify(
          error.response.data
        )}`
      );
      throw new Error(
        `Persona API error: ${
          error.response.data.errors?.[0]?.title || error.message
        }`
      );
    }

    throw error;
  }
};

/**
 * Resume an inquiry and get session token
 * @param {string} inquiryId - The Persona inquiry ID
 * @returns {Promise<Object>} - Returns session token and inquiry status
 */
personaHTTPRepository.getSessionToken = async (inquiryId) => {
  try {
    logger.info(
      `[${context}]: Getting session token for inquiry: ${inquiryId}`
    );
    ObjLog.log(`[${context}]: Getting session token for inquiry: ${inquiryId}`);

    const response = await axios.post(
      `${PERSONA_API_BASE_URL}/inquiries/${inquiryId}/resume`,
      {},
      {
        headers: {
          Authorization: `Bearer ${PERSONA_API_KEY}`,
          "Content-Type": "application/json",
          "Persona-Version": "2023-01-05",
        },
      }
    );

    const sessionToken = response.data.meta["session-token"];

    logger.info(`[${context}]: Session token obtained successfully`);
    ObjLog.log(`[${context}]: Session token obtained successfully`);

    return {
      sessionToken,
      inquiryId: response.data.data.id,
      status: response.data.data.attributes.status,
      fullResponse: response.data,
    };
  } catch (error) {
    logger.error(`[${context}]: Error getting session token: ${error.message}`);
    ObjLog.log(`[${context}]: Error getting session token: ${error.message}`);

    if (error.response) {
      logger.error(
        `[${context}]: Persona API error response: ${JSON.stringify(
          error.response.data
        )}`
      );
      throw new Error(
        `Persona API error: ${
          error.response.data.errors?.[0]?.title || error.message
        }`
      );
    }

    throw error;
  }
};

/**
 * Get inquiry details
 * @param {string} inquiryId - The Persona inquiry ID
 * @returns {Promise<Object>} - Returns inquiry details
 */
personaHTTPRepository.getInquiryDetails = async (inquiryId) => {
  try {
    logger.info(`[${context}]: Getting inquiry details for: ${inquiryId}`);
    ObjLog.log(`[${context}]: Getting inquiry details for: ${inquiryId}`);

    const response = await axios.get(
      `${PERSONA_API_BASE_URL}/inquiries/${inquiryId}`,
      {
        headers: {
          Authorization: `Bearer ${PERSONA_API_KEY}`,
          "Content-Type": "application/json",
          "Persona-Version": "2023-01-05",
        },
      }
    );

    return {
      inquiryId: response.data.data.id,
      status: response.data.data.attributes.status,
      referenceId: response.data.data.attributes["reference-id"],
      createdAt: response.data.data.attributes["created-at"],
      completedAt: response.data.data.attributes["completed-at"],
      fullResponse: response.data,
    };
  } catch (error) {
    logger.error(
      `[${context}]: Error getting inquiry details: ${error.message}`
    );
    ObjLog.log(`[${context}]: Error getting inquiry details: ${error.message}`);

    if (error.response) {
      logger.error(
        `[${context}]: Persona API error response: ${JSON.stringify(
          error.response.data
        )}`
      );
      throw new Error(
        `Persona API error: ${
          error.response.data.errors?.[0]?.title || error.message
        }`
      );
    }

    throw error;
  }
};

export default personaHTTPRepository;
