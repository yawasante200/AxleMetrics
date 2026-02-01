// Mock Authentication Service
// This simulates API calls for authentication - replace with real API integration later

export interface LoginData {
    email: string;
    password: string;
}

export interface IndividualSignupData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    userType: string; // What best describes them
}

export interface CompanySignupData {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    location: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        name: string;
        type: 'individual' | 'company';
    };
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
    // Login
    async login(data: LoginData): Promise<AuthResponse> {
        await delay(1000);

        // Mock validation
        if (data.email && data.password.length >= 6) {
            return {
                success: true,
                message: 'Login successful',
                user: {
                    id: 'user_123',
                    email: data.email,
                    name: 'Demo User',
                    type: 'individual',
                },
            };
        }

        return {
            success: false,
            message: 'Invalid email or password',
        };
    },

    // Individual Registration
    async registerIndividual(data: IndividualSignupData): Promise<AuthResponse> {
        await delay(1000);

        if (data.email && data.fullName && data.password.length >= 6) {
            return {
                success: true,
                message: 'Account created successfully. Please verify your email.',
                user: {
                    id: 'user_' + Date.now(),
                    email: data.email,
                    name: data.fullName,
                    type: 'individual',
                },
            };
        }

        return {
            success: false,
            message: 'Please fill in all required fields',
        };
    },

    // Company Registration
    async registerCompany(data: CompanySignupData): Promise<AuthResponse> {
        await delay(1000);

        if (data.email && data.companyName && data.password.length >= 6) {
            return {
                success: true,
                message: 'Company account created. Please verify your email.',
                user: {
                    id: 'company_' + Date.now(),
                    email: data.email,
                    name: data.companyName,
                    type: 'company',
                },
            };
        }

        return {
            success: false,
            message: 'Please fill in all required fields',
        };
    },

    // Send OTP for email verification
    async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
        await delay(800);

        if (email) {
            return {
                success: true,
                message: 'OTP sent to your email address',
            };
        }

        return {
            success: false,
            message: 'Please provide a valid email',
        };
    },

    // Verify OTP
    async verifyOTP(otp: string): Promise<{ success: boolean; message: string }> {
        await delay(800);

        // Mock: accept any 6-digit OTP
        if (otp.length === 6 && /^\d+$/.test(otp)) {
            return {
                success: true,
                message: 'Email verified successfully',
            };
        }

        return {
            success: false,
            message: 'Invalid OTP. Please try again.',
        };
    },

    // Request password reset
    async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
        await delay(800);

        if (email) {
            return {
                success: true,
                message: 'Password reset link sent to your email',
            };
        }

        return {
            success: false,
            message: 'Please provide a valid email',
        };
    },
    // Confirm password reset
    async confirmResetPassword(password: string): Promise<{ success: boolean; message: string }> {
        await delay(1000);

        if (password && password.length >= 6) {
            return {
                success: true,
                message: 'Password has been reset successfully',
            };
        }

        return {
            success: false,
            message: 'Password must be at least 6 characters',
        };
    },
};
