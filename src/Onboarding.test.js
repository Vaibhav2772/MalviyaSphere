import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import Onboarding from './pages/Onboarding';
import { AuthProvider } from './context/AuthContext';
import { RouterProvider } from './context/RouterContext';

// Helper to render Onboarding inside Context Providers
const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <RouterProvider>
        {ui}
      </RouterProvider>
    </AuthProvider>
  );
};

describe('MalviyaSphere Onboarding Flow Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Step 1: Renders basic information fields and validates required inputs', () => {
    renderWithProviders(<Onboarding />);

    expect(screen.getByText(/Let's build your sphere/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 5/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Academic Programme/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department \/ Branch/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Academic Year/i)).toBeInTheDocument();

    // Click Next Step without filling required fields
    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextBtn);

    // Validation errors should appear
    expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select your department or branch/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select your current academic year/i)).toBeInTheDocument();
  });

  test('Step 1: Dynamic department dropdown updates based on Academic Programme', () => {
    renderWithProviders(<Onboarding />);

    const progSelect = screen.getByLabelText(/Academic Programme/i);
    const branchSelect = screen.getByLabelText(/Department \/ Branch/i);

    // Default programme is undergraduate
    expect(screen.getByRole('option', { name: /Computer Science and Engineering/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Information Technology/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /BBA/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /B.Pharm./i })).toBeInTheDocument();

    // Change to Postgraduate
    fireEvent.change(progSelect, { target: { value: 'postgraduate' } });
    expect(screen.getByRole('option', { name: /M.Tech/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /MBA/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /MCA/i })).toBeInTheDocument();

    // Change to Doctoral
    fireEvent.change(progSelect, { target: { value: 'doctoral' } });
    expect(screen.getByRole('option', { name: /Ph.D/i })).toBeInTheDocument();
  });

  test('Step 1 -> Step 2: Fills valid basic info and progresses to Interests step', () => {
    renderWithProviders(<Onboarding />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Aditi Sharma' } });
    fireEvent.change(screen.getByLabelText(/Academic Programme/i), { target: { value: 'undergraduate' } });
    fireEvent.change(screen.getByLabelText(/Department \/ Branch/i), { target: { value: 'Computer Science and Engineering' } });
    fireEvent.change(screen.getByLabelText(/Academic Year/i), { target: { value: 'Second Year' } });

    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextBtn);

    // Now on Step 2
    expect(screen.getByText(/Step 2 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Interests/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Technology/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Music/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Gaming/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Photography/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Sports/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Art & Design/i })).toBeInTheDocument();
  });

  test('Step 2: Validates at least one interest is selected and allows multi-selection', () => {
    renderWithProviders(<Onboarding />);

    // Fast-fill Step 1
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Aditi Sharma' } });
    fireEvent.change(screen.getByLabelText(/Department \/ Branch/i), { target: { value: 'Computer Science and Engineering' } });
    fireEvent.change(screen.getByLabelText(/Academic Year/i), { target: { value: 'Second Year' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Try clicking next without selecting any interest
    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Please select at least one interest category to proceed/i)).toBeInTheDocument();

    // Select Technology
    const techCard = screen.getByRole('checkbox', { name: /Technology/i });
    fireEvent.click(techCard);
    expect(screen.getByText(/1 of 6 selected/i)).toBeInTheDocument();

    // Select Music
    const musicCard = screen.getByRole('checkbox', { name: /Music/i });
    fireEvent.click(musicCard);
    expect(screen.getByText(/2 of 6 selected/i)).toBeInTheDocument();

    // Move to Step 3
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Step 3 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Niches/i)).toBeInTheDocument();
  });

  test('Step 3: Dynamically displays nested hierarchy for chosen interests and handles back & deselect', () => {
    renderWithProviders(<Onboarding />);

    // Fill Step 1
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Aditi Sharma' } });
    fireEvent.change(screen.getByLabelText(/Department \/ Branch/i), { target: { value: 'Computer Science and Engineering' } });
    fireEvent.change(screen.getByLabelText(/Academic Year/i), { target: { value: 'Second Year' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 2: Select Technology & Music
    fireEvent.click(screen.getByRole('checkbox', { name: /Technology/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Music/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 3: Check categories are visible
    expect(screen.getByRole('heading', { name: /Technology/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Music/i })).toBeInTheDocument();

    // Technology: Drill down into Web Development -> Frontend Development -> React.js
    fireEvent.click(screen.getByRole('button', { name: /Web Development/i }));
    fireEvent.click(screen.getByRole('button', { name: /Frontend Development/i }));
    const reactLeaf = screen.getByRole('checkbox', { name: /React\.js/i });
    expect(reactLeaf).toBeInTheDocument();
    fireEvent.click(reactLeaf);

    // Summary chip and tile should display active path
    expect(screen.getAllByText(/React\.js/i).length).toBeGreaterThanOrEqual(1);

    // Music: Drill down into Singing & Vocals -> Vocal Styles -> Indian Classical
    fireEvent.click(screen.getByRole('button', { name: /Singing & Vocals/i }));
    fireEvent.click(screen.getByRole('button', { name: /Vocal Styles/i }));
    const vocalLeaf = screen.getByRole('checkbox', { name: /Indian Classical/i });
    expect(vocalLeaf).toBeInTheDocument();
    fireEvent.click(vocalLeaf);

    // Click Back to Step 2
    fireEvent.click(screen.getByRole('button', { name: /Go back to previous step/i }));
    expect(screen.getByText(/Step 2 of 5/i)).toBeInTheDocument();

    // Deselect Music
    fireEvent.click(screen.getByRole('checkbox', { name: /Music/i }));
    expect(screen.getByText(/1 of 6 selected/i)).toBeInTheDocument();

    // Return to Step 3
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText(/Step 3 of 5/i)).toBeInTheDocument();

    // Technology should still be present, but Music should be removed from view and descendants cleaned up
    expect(screen.getByRole('heading', { name: /Technology/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^Music$/i })).not.toBeInTheDocument();
  });

  test('Step 3: Requires at least one complete path for EACH selected interest before advancing', () => {
    renderWithProviders(<Onboarding />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Aditi Sharma' } });
    fireEvent.change(screen.getByLabelText(/Department \/ Branch/i), { target: { value: 'Computer Science and Engineering' } });
    fireEvent.change(screen.getByLabelText(/Academic Year/i), { target: { value: 'Second Year' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 2: Select both Gaming and Technology
    fireEvent.click(screen.getByRole('checkbox', { name: /Gaming/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Technology/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 3: Only pick a leaf path for Technology, leave Gaming empty
    fireEvent.click(screen.getByRole('button', { name: /Web Development/i }));
    fireEvent.click(screen.getByRole('button', { name: /Frontend Development/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /React\.js/i }));

    // Try to advance to Step 4 without completing Gaming
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(
      screen.getByText(/Please select at least one complete specialization path ending at a specific focus for each of your selected interests/i)
    ).toBeInTheDocument();

    // Now complete Gaming: Mobile Gaming -> Battle Royale -> BGMI
    fireEvent.click(screen.getByRole('button', { name: /Mobile Gaming/i }));
    fireEvent.click(screen.getByRole('button', { name: /Battle Royale/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /BGMI/i }));

    // Now Next Step should succeed to Step 4
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText(/Step 4 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Skills & Experience/i)).toBeInTheDocument();
  });

  test('Step 4: Skills & Experience allows adding/removing projects and can be skipped', () => {
    renderWithProviders(<Onboarding />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Aditi Sharma' } });
    fireEvent.change(screen.getByLabelText(/Department \/ Branch/i), { target: { value: 'Computer Science and Engineering' } });
    fireEvent.change(screen.getByLabelText(/Academic Year/i), { target: { value: 'Second Year' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 2
    fireEvent.click(screen.getByRole('checkbox', { name: /Technology/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 3: Drill down and select leaf
    fireEvent.click(screen.getByRole('button', { name: /Web Development/i }));
    fireEvent.click(screen.getByRole('button', { name: /Frontend Development/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /React\.js/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Now on Step 4
    expect(screen.getByText(/Step 4 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Skills & Experience/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Skip for now/i })).toBeInTheDocument();

    // Add a project
    const addProjBtn = screen.getByRole('button', { name: /Add Project/i });
    fireEvent.click(addProjBtn);
    expect(screen.getByText(/Project #1/i)).toBeInTheDocument();

    // Remove the project
    const removeBtn = screen.getByRole('button', { name: /Remove Project 1/i });
    fireEvent.click(removeBtn);
    expect(screen.queryByText(/Project #1/i)).not.toBeInTheDocument();

    // Click Skip for now -> should advance to Step 5
    fireEvent.click(screen.getByRole('button', { name: /Skip for now/i }));
    expect(screen.getByText(/Step 5 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Goals & Preferences/i)).toBeInTheDocument();
  });

  test('Step 5 & Completion: Generates personalized goals and displays completion screen with summary', () => {
    renderWithProviders(<Onboarding />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Aditi Sharma' } });
    fireEvent.change(screen.getByLabelText(/Department \/ Branch/i), { target: { value: 'Computer Science and Engineering' } });
    fireEvent.change(screen.getByLabelText(/Academic Year/i), { target: { value: 'Second Year' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 2: Select Gaming and Technology
    fireEvent.click(screen.getByRole('checkbox', { name: /Technology/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Gaming/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 3: Complete paths for Tech and Gaming
    fireEvent.click(screen.getByRole('button', { name: /Web Development/i }));
    fireEvent.click(screen.getByRole('button', { name: /Frontend Development/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /React\.js/i }));

    fireEvent.click(screen.getByRole('button', { name: /Mobile Gaming/i }));
    fireEvent.click(screen.getByRole('button', { name: /Battle Royale/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /BGMI/i }));

    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 4
    fireEvent.click(screen.getByRole('button', { name: /Skip for now/i }));

    // Step 5: Check personalized goals are rendered dynamically
    expect(screen.getByText(/Recommended for your focus areas/i)).toBeInTheDocument();
    expect(screen.getByText(/Find competitive gaming squad/i)).toBeInTheDocument();
    expect(screen.getByText(/Team up for hackathons/i)).toBeInTheDocument();

    // Try completing without selecting goal
    const completeBtn = screen.getByRole('button', { name: /Complete Profile/i });
    fireEvent.click(completeBtn);
    expect(screen.getByText(/Please select at least one goal/i)).toBeInTheDocument();

    // Select Personalized Goal and Collab Preference
    fireEvent.click(screen.getByText(/Find competitive gaming squad/i));
    fireEvent.click(screen.getByRole('checkbox', { name: /Project teams/i }));
    fireEvent.click(screen.getByRole('radio', { name: /Flexible/i }));

    // Complete profile
    fireEvent.click(completeBtn);

    // Completion Screen
    expect(screen.getByText(/Your sphere is taking shape!/i)).toBeInTheDocument();
    expect(screen.getByText(/Aditi Sharma/i)).toBeInTheDocument();
    expect(screen.getByText(/Computer Science and Engineering · Second Year/i)).toBeInTheDocument();
    expect(screen.getAllByText(/BGMI/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Continue to MalviyaSphere/i })).toBeInTheDocument();
  });

  test('Step 4: Validates URLs when provided with invalid format', () => {
    renderWithProviders(<Onboarding />);

    // Fast-navigate to Step 4
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Aditi Sharma' } });
    fireEvent.change(screen.getByLabelText(/Department \/ Branch/i), { target: { value: 'Computer Science and Engineering' } });
    fireEvent.change(screen.getByLabelText(/Academic Year/i), { target: { value: 'Second Year' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    fireEvent.click(screen.getByRole('checkbox', { name: /Technology/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    fireEvent.click(screen.getByRole('button', { name: /Web Development/i }));
    fireEvent.click(screen.getByRole('button', { name: /Frontend Development/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /React\.js/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // On Step 4, enter invalid portfolio URL
    const portfolioInput = screen.getByLabelText(/Portfolio URL/i);
    fireEvent.change(portfolioInput, { target: { value: 'invalid_url_without_domain' } });

    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Should block Next Step and show error
    expect(screen.getByText(/Please enter a valid URL/i)).toBeInTheDocument();
    expect(screen.getByText(/Please correct the invalid URL format/i)).toBeInTheDocument();

    // Fix the URL
    fireEvent.change(portfolioInput, { target: { value: 'https://aditi.dev' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Should now proceed to Step 5
    expect(screen.getByText(/Step 5 of 5/i)).toBeInTheDocument();
  });

  test('Draft Persistence: Loads draft from localStorage on mount', () => {
    const savedDraft = {
      fullName: 'Rahul Verma',
      programme: 'undergraduate',
      branch: 'Information Technology',
      academicYear: 'Third Year',
      interests: ['technology'],
      selectedPaths: [
        {
          pathId: 'technology/web-development/frontend-development/react-js',
          rootId: 'technology',
          leafLabel: 'React.js',
          pathLabels: ['Technology', 'Web Development', 'Frontend Development', 'React.js'],
        },
      ],
      niches: ['React.js'],
      _savedStep: 2,
    };
    localStorage.setItem('malviyasphere_onboarding_draft', JSON.stringify(savedDraft));

    renderWithProviders(<Onboarding />);

    // Should restore to Step 2
    expect(screen.getByText(/Step 2 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/1 of 6 selected/i)).toBeInTheDocument();
  });
});

